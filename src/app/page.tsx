import { npcDatas } from "@/lib/data/npcDatas";
import Dictaphone from "@/ui/Dictaphone";
import { NpcCard } from "@/ui/NpcCard";
import Link from "next/link";
import { ReactElement } from "react";



export default function Home(): ReactElement {

  return (
    <>
      <div className="flex justify-evenly w-full">
        {npcDatas.map(npc => {
          return (
            <Link href={`/${npc.name}`}>
              <NpcCard 
              key={npc.name} npc={npc} 
              />
            </Link>
        )})}
      </div>
    </>
  );
}
