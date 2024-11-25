import { useEffect, useRef, useState } from 'react';
import { getAzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt, transcribeAudioBase64 } from '@/lib/api/chatGpt'; // Assurez-vous que transcribeAudioBase64 existe
import { Message, Messages } from '@/lib/types/Messages';
import Meyda from 'meyda';
import { Npc } from '../api/fetchGamesAndNpcsFromUser';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';

export const useDictaphone = () => {
  const router = useRouter();
  const param = useParams();
  const { npc: npcName } = param; // Récupère le nom du PNJ dans l'URL
  const [currentNpc, setCurrentNpc] = useState<Npc | null>(null);
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [listening, setListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const activeAudioRef = useRef<HTMLAudioElement | null>(null); // Référence pour l'Audio actif
  const hasGreetedRef = useRef(false); // Indique si le PNJ a déjà parlé après redirection
  const { gameData } = useAppContext();
  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        })
        .catch((error) => {
          console.error("Erreur lors de l'accès au microphone :", error);
        });
    }
  }, []);

  useEffect(() => {
    if (npcName) {
      const game = gameData.find((game) => game.gameId === 1);
      const npc = game?.npcs.find((npc) => npc.name === npcName);
      if (npc) {
        setCurrentNpc(npc);
        setMessages([]); // Réinitialise les messages pour le nouveau PNJ

        // Le PNJ salue automatiquement (uniquement si ce n'est pas déjà fait)
        if (!hasGreetedRef.current) {
          greetNpc(npc);
          hasGreetedRef.current = true; // Marque que le PNJ a salué
        }
      }
    }
  }, [npcName]);

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
          {
            name: npc.voiceName,
            pitch: npc.voicePitch,
            rate: npc.voiceRate,
            style: npc.voiceStyle,
          },
        );
        const audio = new Audio(base64AudioResponse);

        // Stocker l'instance Audio
        activeAudioRef.current = audio;

        audio.play();
        setMessages([{ role: 'assistant', content: textResponse.content }]);

        audio.addEventListener('ended', () => {
          activeAudioRef.current = null; // Réinitialiser après la fin de la lecture
        });
      }
    } catch (error) {
      console.error('Erreur pendant la salutation :', error);
    } finally {
      setIsFetching(false);
    }
  };

  const getResponse = async (newMessage: Message) => {
    if (!currentNpc || newMessage.content.length === 0 || isFetching) return;

    // Arrêter l'audio actif si l'utilisateur parle
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    try {
      const textResponse = await askChatGpt(currentNpc, [
        ...messages,
        newMessage,
      ]);

      if (!textResponse) throw new Error("Impossible d'obtenir une réponse");

      const npcMentioned = currentNpc.relatedNpcsNames.find((name) =>
        textResponse.content.includes(name),
      );

      const base64AudioResponse = await getAzureSpeechSynthesis(
        textResponse.content,
        {
          name: currentNpc.voiceName,
          rate: currentNpc.voiceRate,
          pitch: currentNpc.voicePitch,
          style: currentNpc.voiceStyle,
        },
      );
      const audio = new Audio(base64AudioResponse);

      // Stocker l'instance Audio
      activeAudioRef.current = audio;

      audio.play();

      // Rediriger vers le prochain NPC après la lecture audio
      audio.addEventListener('ended', () => {
        activeAudioRef.current = null; // Réinitialiser après lecture
        if (npcMentioned) {
          hasGreetedRef.current = false; // Reset pour le prochain PNJ
          router.push(`/${npcMentioned}`);
        }
      });

      setMessages((prevMessages) => [...prevMessages, textResponse]);
    } catch (error) {
      console.error('Erreur pendant la réponse :', error);
    } finally {
      setIsFetching(false);
    }
  };

  const startListening = () => {
    if (!mediaRecorder) {
      console.warn('Micro non disponible');
      return;
    }

    if (listening) {
      console.warn("L'écoute est déjà active");
      return;
    }

    // Arrêter l'audio actif si l'utilisateur commence à parler
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

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
            console.error('Erreur de transcription :', error);
          }
        }
      };
      reader.readAsDataURL(audioBlob);
    };
  };

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
