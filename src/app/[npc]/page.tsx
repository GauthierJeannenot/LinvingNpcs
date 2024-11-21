'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NpcType from '@/lib/types/Npc';
import { Dictaphone } from '@/ui/Dictaphone';
import { npcs } from '@/lib/data/npc';

export default function Npc() {
  const param = useParams();

  const [npc, setNpc] = useState<NpcType | null>(null);

  useEffect(() => {
    const response = npcs.find((npc) => npc.name === param.npc);
    if (response) {
      setNpc(response);
    }
  }, [param.npc]);

  if (npc === null) return;

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-900 text-gray-100 pt-4">
      <div className="w-[100%] max-w-8xl text-center bg-gray-800 p-4 rounded-xl shadow-lg my-auto">
        <Dictaphone />
      </div>
    </div>
  );
}
