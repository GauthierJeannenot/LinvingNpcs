'use client';
import 'regenerator-runtime/runtime';
import MicIcon from '@mui/icons-material/Mic';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ChatWindow } from './ChatWindow';
import { useDictaphone } from '@/lib/utils/useDictaphone';
import { NpcCard } from './NpcCard';

export const Dictaphone = () => {
  const {
    currentNpc, // Utilise directement le NPC actif du hook
    startListening,
    stopListening,
    isFetching,
    listening,
    messages,
  } = useDictaphone();

  const handleButtonClick = () => {
    if (listening) {
      stopListening(); // Arrêter l'écoute si en cours
    } else {
      startListening(); // Commencer l'écoute si arrêté
    }
  };

  if (!currentNpc) return null;

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 bg-gray-50 rounded-lg shadow-md">
      {/* Affichage du NPC actuel */}
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <NpcCard npc={currentNpc} />
        </div>
        <h1 className="text-lg font-bold text-gray-800">
          {currentNpc.name} {currentNpc.lastName}
        </h1>
      </div>

      {/* Bouton pour démarrer/arrêter l'écoute */}
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

      {/* Fenêtre de chat */}
      <div className="w-full max-w-8xl mt-4">
        <ChatWindow messages={messages} npcName={currentNpc.name} />
      </div>
    </div>
  );
};
