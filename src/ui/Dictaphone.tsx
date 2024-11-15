'use client';
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import Npc from '@/lib/types/Npc';
import { askChatGpt } from '@/lib/api/chatGpt';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { useEffect, useState } from 'react';
import MicIcon from '@mui/icons-material/Mic'; // For microphone icon
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChatWindow } from './ChatWindow';
import { Messages } from '@/lib/types/Messages';

const Dictaphone = ({ npc }: { npc: Npc }) => {
  const { finalTranscript, transcript, listening } = useSpeechRecognition();
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);
  console.log(transcript);
  useEffect(() => {
    const getResponse = async () => {
      if (finalTranscript.length === 0) return; // Prévenir un appel inutile

      setIsFetching(true);

      // Crée un nouveau message utilisateur et l'ajoute au state
      const newMessage = { role: 'user', content: finalTranscript };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        // Appeler GPT et obtenir la réponse
        const textResponse = await askChatGpt(npc, [...messages, newMessage]);
        if (!textResponse) throw new Error("Couldn't get chatgpt response");

        const base64AudioResponse = await AzureSpeechSynthesis(
          textResponse.content,
        );
        if (!base64AudioResponse)
          throw new Error("Couldn't get audio response");

        const audio = new Audio(base64AudioResponse);
        audio.play().finally(() => setIsFetching(false));

        // Ajouter la réponse du GPT aux messages
        setMessages((prevMessages) => [...prevMessages, textResponse]);
      } catch (error) {
        console.error('Error:', error);
        setIsFetching(false);
      }
    };

    getResponse();
  }, [finalTranscript, npc]); // Utilise finalTranscript comme dépendance

  return (
    <div>
      <div className="mt-4">
        {isFetching ? (
          <p>Loading ...</p>
        ) : (
          <button
            disabled={isFetching}
            onClick={() => SpeechRecognition.startListening()}
          >
            {listening ? <FiberManualRecordIcon /> : <MicIcon />}
          </button>
        )}
      </div>

      <ChatWindow messages={messages} npcName={npc.name} />
    </div>
  );
};

export default Dictaphone;
