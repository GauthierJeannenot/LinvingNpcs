import Image from 'next/image';
import Npc from '@/lib/types/Npc';

export const NpcCard = ({ npc }: { npc: Npc }) => {
  return (
    <div className="max-w-xs mx-auto bg-white rounded-full overflow-hidden relative">
      <Image
        src={npc.picture}
        width={150}
        height={150}
        alt="Character Image"
        className="w-full h-48 object-cover"
      />

      {/* <!-- Overlapping Title Container at the Bottom --> */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h2 className="text-lg font-semibold text-white text-center transform -translate-y-6">
          {npc.name}
        </h2>
      </div>
    </div>
  );
};
