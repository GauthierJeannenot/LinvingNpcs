'use client';
import 'regenerator-runtime/runtime';
import MicIcon from '@mui/icons-material/Mic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChatWindow } from './ChatWindow';
import Npc from '@/lib/types/Npc';
import { useDictaphone } from '@/lib/utils/useDictaphone';

export const Dictaphone = ({ npc }: { npc: Npc }) => {
  const { startListening, isFetching, listening, messages } =
    useDictaphone(npc);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-4">
        {isFetching ? (
          <p className="text-gray-500 font-medium animate-pulse">
            Chargement...
          </p>
        ) : (
          <button
            className={`p-4 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-transform transform ${
              listening ? 'scale-105' : ''
            } focus:outline-none focus:ring-4 focus:ring-blue-300`}
            disabled={isFetching}
            onClick={startListening}
          >
            {listening ? (
              <FiberManualRecordIcon className="text-red-600 animate-pulse" />
            ) : (
              <MicIcon className="text-white" />
            )}
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl mt-4">
        <ChatWindow messages={messages} npcName={npc.name} />
      </div>
    </div>
  );
};
