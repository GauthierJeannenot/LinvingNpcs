import Image from 'next/image';
import Npc from '@/lib/types/Npc';

export const NpcCard = ({ npc }: { npc: Npc }) => {
  return (
    <div className="max-w-xs mx-auto bg-white rounded-3xl overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
      <Image
        src={npc.picture}
        width={150}
        height={150}
        alt={`Image of ${npc.name}`}
        className="w-full h-48 object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h2 className="text-lg font-semibold text-white text-center">
          {npc.name}
        </h2>
      </div>
    </div>
  );
};
