import { useEffect, useState } from 'react';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt } from '@/lib/api/chatGpt';
import Npc from '@/lib/types/Npc';
import { Message, Messages } from '@/lib/types/Messages';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export const useDictaphone = (npc: Npc) => {
  const { finalTranscript, listening } = useSpeechRecognition();
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Fonction pour obtenir la réponse de ChatGPT
  const getResponse = async (newMessage: Message) => {
    if (newMessage.content.length === 0 || isFetching) return;

    setIsFetching(true);

    try {
      const textResponse = await askChatGpt(npc, [...messages, newMessage]);
      if (!textResponse) throw new Error("Couldn't get chatgpt response");

      const base64AudioResponse = await AzureSpeechSynthesis(
        textResponse.content,
      );
      if (!base64AudioResponse) throw new Error("Couldn't get audio response");

      const audio = new Audio(base64AudioResponse);
      audio.play();

      // Mise à jour de l'état des messages
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
        textResponse,
      ]);
      setIsFetching(false);
    } catch (error) {
      console.error('Error:', error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (finalTranscript.length !== 0) {
      const newMessage = { role: 'user', content: finalTranscript };

      // Appel à la fonction pour obtenir la réponse
      getResponse(newMessage);
    }
  }, [finalTranscript, npc]); // Ne dépend que de finalTranscript et npc

  return {
    messages,
    isFetching,
    startListening: () => SpeechRecognition.startListening(),
    listening,
  };
};
