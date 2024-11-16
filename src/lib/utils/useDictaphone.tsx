import { useEffect, useState } from 'react';
import { getAzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt'; // Assurez-vous que transcribeAudioBase64 existe
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';
import Meyda from 'meyda';

export const useDictaphone = (npc: Npc) => {
  const [messages, setMessages] = useState<Messages>(
    Array.from({ length: 50 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'npc',
      content: `Message ${i + 1}`,
    })),
  );

  const [isFetching, setIsFetching] = useState(false);
  const [listening, setListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  console.log(mediaRecorder);

  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        })
        .catch((error) => {
          console.error("Erreur lors de l'accès au microphone:", error);
        });
    }
  }, []);

  const getResponse = async (newMessage: Message) => {
    if (newMessage.content.length === 0 || isFetching) return;

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const textResponse = await askChatGpt(npc, [...messages, newMessage]);
      if (!textResponse) throw new Error("Couldn't get chatgpt response");

      const base64AudioResponse = await getAzureSpeechSynthesis(
        textResponse.content,
        npc.voice,
      );
      if (!base64AudioResponse) throw new Error("Couldn't get audio response");

      const audio = new Audio(base64AudioResponse);
      audio.play();

      setMessages((prevMessages) => [...prevMessages, textResponse]);
      setIsFetching(false);
    } catch (error) {
      console.error('Error:', error);
      setIsFetching(false);
    }
  };

  const startListening = () => {
    if (!mediaRecorder) {
      console.warn('MediaRecorder not available');
      return;
    }

    setListening(true);
    const audioChunks: Blob[] = [];
    let silenceCounter = 0; // Compteur naïf de périodes de silence
    const maxSilenceCount = 200; // Valeur maximale avant d'arrêter l'enregistrement

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    // Configuration de l'AudioContext et de Meyda
    const audioContext = new window.AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(
      mediaRecorder.stream,
    );
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    mediaStreamSource.connect(analyser);

    const meydaAnalyzer = Meyda.createMeydaAnalyzer({
      audioContext,
      source: mediaStreamSource,
      bufferSize: 512,
      featureExtractors: ['rms'],
      callback: (features: { rms: number }) => {
        const { rms } = features;

        if (rms < 0.01) {
          // Seuil simple pour la détection de silence
          silenceCounter++;
          console.log(
            `Silence détecté. Compteur de silence : ${silenceCounter}`,
          );
          if (silenceCounter >= maxSilenceCount) {
            console.log(
              "Arrêt de l'enregistrement après seuil de silence atteint",
            );
            stopListening(); // Arrête l'enregistrement
          }
        } else {
          console.log('Voix détectée. Réinitialisation du compteur de silence');
          silenceCounter = 0; // Réinitialisation du compteur si du son est détecté
        }
      },
    });

    meydaAnalyzer.start();

    mediaRecorder.onstop = async () => {
      setListening(false);
      meydaAnalyzer.stop();
      mediaStreamSource.disconnect(); // Déconnecte la source
      audioContext.close(); // Ferme le contexte audio

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          try {
            setIsFetching(true);
            const transcription = await transcribeAudioBase64(base64Data);
            if (transcription) {
              const newMessage: Message = {
                role: 'user',
                content: transcription,
              };
              getResponse(newMessage);
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    };
  };

  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log("Arrêt de l'enregistrement via stopListening");
      mediaRecorder.stop();
    } else {
      console.log("Le mediaRecorder n'est pas dans un état d'enregistrement");
    }
  };

  return {
    messages,
    isFetching,
    startListening,
    listening,
  };
};
