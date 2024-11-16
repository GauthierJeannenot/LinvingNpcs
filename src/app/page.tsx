import Link from 'next/link';
import { ReactElement } from 'react';
import { npcDatas } from '@/lib/data/npcDatas';
import { NpcCard } from '@/ui/NpcCard';

export default function Home(): ReactElement {
  return (
    <>
      <div className="flex justify-evenly w-full flex-wrap">
        {npcDatas.map((npc) => {
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
