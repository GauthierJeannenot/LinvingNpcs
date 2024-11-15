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
    <div className="flex flex-col items-center justify-center py-4">
      <div className="mb-4">
        {isFetching ? (
          <p className="text-gray-600">Chargement...</p>
        ) : (
          <button
            className="p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
            disabled={isFetching}
            onClick={startListening}
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
