'use server';

import { supabase } from '../supabase';

type Npc = {
  id: number;
  name: string | null;
};

export type GameData = {
  gameId: number | null; 
  npcs: Npc[]; 
};

export const fetchGamesAndNpcsFromUser = async (
  id: number
): Promise<GameData[]> => {
  const { data, error } = await supabase
  .from('user_game')
  .select(`
    gameId,
    Game (
      id,
      game_npc (
        npcId,
        Npc (
          id,
          name
        )
      )
    )
  `).eq('userId', id);

  if (error) {
    throw error;
  }

  return (
    data.map((item) => {
      const gameId = item.gameId;
      const npcs =
        item.Game?.game_npc.map((npc) => ({
          id: npc.Npc?.id ?? 0, // Default to 0 if undefined
          name: npc.Npc?.name ?? null, // Default to null if undefined
        })) || [];

      return { gameId, npcs };
    }) || []
  ); // Default to an empty array if data is null
};