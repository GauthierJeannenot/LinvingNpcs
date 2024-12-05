'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dictaphone } from '@/ui/Dictaphone';
import type { Npc } from '@/lib/api/fetchGamesAndNpcsFromUser';
import { useAppContext } from '@/lib/context/AppContext';

export default function Npc() {
  const param = useParams();
  const { gameData } = useAppContext();

  const [npc, setNpc] = useState<Npc | null>(null);
  console.log(gameData);
  useEffect(() => {
    const game = gameData.find((game) => {
      return game.gameName === param.game;
    });
    if (game) {
      const npcData = game.npcs.find((npc) => {
        return npc.name === param.npc;
      });
      if (npcData) {
        setNpc(npcData);
      }
    }
  }, [param.npc, gameData]);

  if (npc === null) return;

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-900 text-gray-100 pt-4">
      <div className="w-[100%] max-w-8xl text-center bg-gray-800 p-4 rounded-xl shadow-lg my-auto">
        <Dictaphone />
      </div>
    </div>
  );
}
