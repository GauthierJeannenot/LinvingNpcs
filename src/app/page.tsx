import Link from 'next/link';
import { ReactElement } from 'react';
import { NpcCard } from '@/ui/NpcCard';
import { npcs } from '@/lib/data/npc';

export default function Home(): ReactElement {
  return (
    <>
      <div className="flex justify-evenly w-full flex-wrap">
        {npcs.map((npc) => {
          return (
            <Link href={`/${npc.name}`} key={npc.name} className="p-4">
              <NpcCard key={npc.name} npc={npc} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
