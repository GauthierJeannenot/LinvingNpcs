import { useEffect, useState } from 'react';
import { getAzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt'; // Assurez-vous que transcribeAudioBase64 existe
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';

export const useDictaphone = (npc: Npc) => {
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [listening, setListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

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
    mediaRecorder.start();

    // Utilisation de l'AudioContext pour analyser le son
    const audioContext = new window.AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(
      mediaRecorder.stream,
    );
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    mediaStreamSource.connect(analyser);

    let silenceTimeout: NodeJS.Timeout | null = null;
    let isSpeaking = false;
    let noiseLevelSum = 0;
    let noiseSampleCount = 0;
    let adaptiveThreshold = 15; // Valeur initiale du seuil, ajustable selon l'environnement

    const checkForSilence = () => {
      analyser.getByteTimeDomainData(dataArray);

      let maxAmplitude = 0;
      for (let i = 0; i < bufferLength; i++) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(dataArray[i] - 128));
      }

      // Mise à jour de l'estimation du bruit ambiant
      if (!isSpeaking) {
        noiseLevelSum += maxAmplitude;
        noiseSampleCount++;
        adaptiveThreshold = noiseLevelSum / noiseSampleCount + 5; // Ajuste le seuil avec une marge de 5 unités pour détecter le silence
      }
      // Détection de la parole ou du silence
      if (maxAmplitude < adaptiveThreshold) {
        // Utilise le seuil adaptatif
        if (isSpeaking) {
          // Détection du silence après avoir parlé
          if (silenceTimeout) {
            clearTimeout(silenceTimeout);
          }
          silenceTimeout = setTimeout(() => {
            stopListening(); // Arrête l'enregistrement après une période de silence
          }, 500); // Délai après lequel on considère que l'utilisateur a fini de parler (ajuste selon tes besoins)
        }
      } else {
        isSpeaking = true;
        if (silenceTimeout) {
          clearTimeout(silenceTimeout);
        }
      }

      if (mediaRecorder.state === 'recording') {
        requestAnimationFrame(checkForSilence);
      }
    };

    checkForSilence();

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      setListening(false);

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

  // Fonction pour arrêter l'enregistrement
  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  return {
    messages,
    isFetching,
    startListening,
    listening,
  };
};
