'use client';

import Image from 'next/image';
import Npc from '@/lib/types/Npc';
import { useIsSmallScreen } from '@/lib/utils/useIsSmallScreen';

export const NpcCard = ({ npc }: { npc: Npc }) => {
  const isSmallScreen = useIsSmallScreen();
  return (
    <div className="max-w-xs mx-auto bg-white rounded-full overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
      <Image
        src={npc.picture}
        width={isSmallScreen ? 50 : 150}
        height={isSmallScreen ? 50 : 150}
        alt={`Image of ${npc.name}`}
        className={`${isSmallScreen ? 'rounded-fullw-12 h-12 object-cover' : 'w-full object-cover'}`}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h2 className="text-lg font-semibold text-white text-center">
          {npc.name}
        </h2>
      </div>
    </div>
  );
};
