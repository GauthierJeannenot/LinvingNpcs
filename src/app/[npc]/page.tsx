'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { npcDatas } from '@/lib/data/npcDatas';
import NpcType from '@/lib/types/Npc';
import { Dictaphone } from '@/ui/Dictaphone';

export default function Npc() {
  const param = useParams();

  const [npc, setNpc] = useState<NpcType>({
    name: '',
    picture: '',
    personae: '',
    lastName: '',
  });

  useEffect(() => {
    const response = npcDatas.find((npc) => npc.name === param.npc);
    if (response) {
      setNpc(response);
    }
  }, [param.npc]);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex-col w-[95%] text-center">
        <h1 className="mt-4">
          {npc.name} {npc.lastName}
        </h1>
        {<Dictaphone npc={npc} />}
      </div>
    </div>
  );
}
