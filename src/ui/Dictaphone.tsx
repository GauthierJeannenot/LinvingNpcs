'use client';
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { useEffect, useState } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChatWindow } from './ChatWindow';
import { AzureSpeechSynthesis } from '@/lib/api/azureSpeech';
import { askChatGpt } from '@/lib/api/chatGpt';
import Npc from '@/lib/types/Npc';
import { Messages } from '@/lib/types/Messages';

export const Dictaphone = ({ npc }: { npc: Npc }) => {
  const { finalTranscript, listening } = useSpeechRecognition();
  const [messages, setMessages] = useState<Messages>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getResponse = async () => {
      if (finalTranscript.length === 0) return;

      setIsFetching(true);

      const newMessage = { role: 'user', content: finalTranscript };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const textResponse = await askChatGpt(npc, [...messages, newMessage]);
        if (!textResponse) throw new Error('Couldn\'t get chatgpt response');

        const base64AudioResponse = await AzureSpeechSynthesis(
          textResponse.content,
        );
        if (!base64AudioResponse)
          throw new Error('Couldn\'t get audio response');

        const audio = new Audio(base64AudioResponse);
        audio.play().finally(() => setIsFetching(false));

        setMessages((prevMessages) => [...prevMessages, textResponse]);
      } catch (error) {
        console.error('Error:', error);
        setIsFetching(false);
      }
    };

    getResponse();
  }, [finalTranscript, npc, messages]);

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="mb-4">
        {isFetching ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <button
            className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
            disabled={isFetching}
            onClick={() => SpeechRecognition.startListening()}
          >
            {listening ? (
              <FiberManualRecordIcon className="text-red-600" />
            ) : (
              <MicIcon />
            )}
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl">
        <ChatWindow messages={messages} npcName={npc.name} />
      </div>
    </div>
  );
};
