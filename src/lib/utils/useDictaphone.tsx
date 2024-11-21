import { useEffect, useState } from 'react';
import { getAzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt';
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';
import Meyda from 'meyda';
import { npcs } from '../data/npc';
import { useParams, useRouter } from 'next/navigation';

export const useDictaphone = () => {
  const router = useRouter();
  const param = useParams();
  const npcName = param.npc; // Récupère le nom du NPC dans l'URL
  const [currentNpc, setCurrentNpc] = useState<Npc | null>(null);
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [listening, setListening] = useState(false);
  const [mediaRecorder] = useState<MediaRecorder | null>(null);

  // Synchroniser `currentNpc` avec le paramètre d'URL
  useEffect(() => {
    if (npcName) {
      const matchedNpc = npcs.find((npc) => npc.name === npcName);
      if (matchedNpc) {
        setCurrentNpc(matchedNpc);
        setMessages([]); // Réinitialiser les messages à chaque changement de NPC
        greetNpc(matchedNpc); // Faire parler le NPC automatiquement
      }
    }
  }, [npcName]);

  // Fonction pour saluer automatiquement lorsque le joueur arrive
  const greetNpc = async (npc: Npc) => {
    const greetingMessage: Message = {
      role: 'system',
      content: `Le joueur arrive pour parler avec ${npc.name}.`,
    };

    setIsFetching(true);
    try {
      const textResponse = await askChatGpt(npc, [greetingMessage]);

      if (textResponse) {
        const base64AudioResponse = await getAzureSpeechSynthesis(
          textResponse.content,
          npc.voice,
        );
        const audio = new Audio(base64AudioResponse);
        audio.play();

        setMessages([{ role: 'assistant', content: textResponse.content }]);
      }
    } catch (error) {
      console.error('Error during greeting:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Fonction pour gérer la réponse du NPC
  const getResponse = async (newMessage: Message) => {
    if (!currentNpc || newMessage.content.length === 0 || isFetching) return;

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const textResponse = await askChatGpt(currentNpc, [
        ...messages,
        newMessage,
      ]);

      if (!textResponse) throw new Error("Couldn't get chatgpt response");

      const npcMentioned = currentNpc.connections.find((name) =>
        textResponse.content.includes(name),
      );

      const base64AudioResponse = await getAzureSpeechSynthesis(
        textResponse.content,
        currentNpc.voice,
      );
      const audio = new Audio(base64AudioResponse);
      audio.play();

      // Rediriger vers le nouveau NPC après la lecture audio
      audio.addEventListener('ended', () => {
        if (npcMentioned) {
          router.push(`/npc/${npcMentioned}`); // Navigation vers la page du nouveau NPC
        }
      });

      setMessages((prevMessages) => [...prevMessages, textResponse]);
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Fonction pour commencer l'écoute
  const startListening = () => {
    if (!mediaRecorder || listening) return;

    setListening(true);
    const audioChunks: Blob[] = [];
    let silenceCounter = 0;
    const maxSilenceCount = 200;

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    const audioContext = new window.AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(
      mediaRecorder.stream,
    );

    const bandPassFilter = audioContext.createBiquadFilter();
    bandPassFilter.type = 'bandpass';
    bandPassFilter.frequency.value = 200;
    bandPassFilter.Q.setValueAtTime(1, audioContext.currentTime);
    mediaStreamSource.connect(bandPassFilter);

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    bandPassFilter.connect(analyser);

    const meydaAnalyzer = Meyda.createMeydaAnalyzer({
      audioContext,
      source: bandPassFilter,
      bufferSize: 512,
      featureExtractors: ['rms'],
      callback: (features: { rms: number }) => {
        if (features.rms < 0.01) {
          silenceCounter++;
          if (silenceCounter >= maxSilenceCount) stopListening();
        } else {
          silenceCounter = 0;
        }
      },
    });

    meydaAnalyzer.start();

    mediaRecorder.onstop = async () => {
      setListening(false);
      meydaAnalyzer.stop();
      mediaStreamSource.disconnect();
      bandPassFilter.disconnect();
      audioContext.close();

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          try {
            setIsFetching(true);
            const transcription = await transcribeAudioBase64(base64Data);
            if (transcription) {
              getResponse({ role: 'user', content: transcription });
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    };
  };

  // Fonction pour arrêter l'écoute
  const stopListening = () => {
    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop();
    }
    setListening(false);
  };

  return {
    currentNpc,
    messages,
    isFetching,
    startListening,
    stopListening,
    listening,
  };
};
