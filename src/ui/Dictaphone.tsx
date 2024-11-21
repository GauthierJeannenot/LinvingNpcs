'use client';
import 'regenerator-runtime/runtime';
import MicIcon from '@mui/icons-material/Mic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChatWindow } from './ChatWindow';
import Npc from '@/lib/types/Npc';
import { useDictaphone } from '@/lib/utils/useDictaphone';

export const Dictaphone = ({ npc }: { npc: Npc }) => {
  const { startListening, stopListening, isFetching, listening, messages } =
    useDictaphone(npc);

  const handleButtonClick = () => {
    if (listening) {
      stopListening(); // Arrêter l'écoute si en cours
    } else {
      startListening(); // Commencer l'écoute si arrêté
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-2">
        {isFetching ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <button
            className={`p-4 rounded-full ${
              listening ? 'bg-red-500' : 'bg-blue-500'
            } text-white shadow-lg hover:scale-110 transition-transform transform ${
              listening ? 'scale-105' : ''
            } focus:outline-none focus:ring-4 ${
              listening ? 'focus:ring-red-300' : 'focus:ring-blue-300'
            }`}
            disabled={isFetching}
            onClick={handleButtonClick}
          >
            {listening ? (
              <FiberManualRecordIcon className="animate-pulse" />
            ) : (
              <MicIcon className="text-white" />
            )}
          </button>
        )}
      </div>

      <div className="w-full max-w-8xl mt-2">
        <ChatWindow messages={messages} npcName={npc.name} />
      </div>
    </div>
  );
};
