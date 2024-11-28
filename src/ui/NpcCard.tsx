'use client';

import Image from 'next/image';
import { useIsSmallScreen } from '@/lib/utils/useIsSmallScreen';
import { Npc } from '@/lib/api/fetchGamesAndNpcsFromUser';

export const NpcCard = ({ npc }: { npc: Npc }) => {
  const isSmallScreen = useIsSmallScreen();
  return (
    <div
      className={
        isSmallScreen
          ? ''
          : `max-w-xs mx-auto bg-white rounded-full overflow-hidden relative shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl`
      }
    >
      <Image
        priority
        src={npc.picture}
        width={150}
        height={150}
        alt={`Image of ${npc.name}`}
        className={`${
          isSmallScreen
            ? 'rounded-full w-32 h-32 border-2 border-gray-300 shadow-sm'
            : 'w-full h-full object-cover'
        } object-cover transition-all duration-300 ease-in-out`}
        style={{ margin: '0 auto', padding: '2px' }}
      />

      {!isSmallScreen && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <h2 className="text-lg font-semibold text-white text-center">
            {npc.name}
          </h2>
        </div>
      )}
    </div>
  );
};
