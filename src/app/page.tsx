'use client';
import Link from 'next/link';
import { ReactElement } from 'react';
import { NpcCard } from '@/ui/NpcCard';
import { useAppContext } from '@/lib/context/AppContext';

export default function Home(): ReactElement {
  const { gameData } = useAppContext();

  return (
    <>
      <div className="flex justify-evenly w-full flex-wrap">
        {gameData.map((game) => (
          <div key={game.gameId} className="w-full mb-6">
            {/* Game Name */}
            <div className="text-2xl font-bold text-center mb-4">
              {game.gameName}
            </div>

            {/* NPCs for the Game */}
            <div className="flex justify-evenly flex-wrap">
              {game.npcs.map((npc) => (
                <Link
                  href={`/${game.gameName}/${npc.name}`}
                  key={npc.name}
                  className="p-4"
                >
                  <NpcCard key={npc.name} npc={npc} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
