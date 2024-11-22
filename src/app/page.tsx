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
        {gameData.map((game) => {
          return game.npcs.map((npc) => {
            return (
              <Link href={`/${npc.name}`} key={npc.name} className="p-4">
                <NpcCard key={npc.name} npc={npc} />
              </Link>
            );
          });
        })}
      </div>
    </>
  );
}
