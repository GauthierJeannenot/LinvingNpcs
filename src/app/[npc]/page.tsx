'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { npcDatas } from '@/lib/data/npcDatas';
import NpcType from '@/lib/types/Npc';
import { Dictaphone } from '@/ui/Dictaphone';
import { NpcCard } from '@/ui/NpcCard';

export default function Npc() {
  const param = useParams();

  const [npc, setNpc] = useState<NpcType | null>(null);

  useEffect(() => {
    const response = npcDatas.find((npc) => npc.name === param.npc);
    if (response) {
      setNpc(response);
    }
  }, [param.npc]);

  if (npc === null) return;

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-900 text-gray-100 py-8">
      <div className="w-[95%] max-w-3xl text-center bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="pb-8">
          <NpcCard npc={npc} />
        </div>
        <Dictaphone npc={npc} />
      </div>
    </div>
  );
}
