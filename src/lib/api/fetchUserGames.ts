'use server';

import { supabase } from '../supabase';
import { QueryData } from '@supabase/supabase-js'

interface Npc {
    id: number;
    name: string;
  }
  
  interface GameNpc {
    npcId: number;
    Npc: Npc[];
  }
  
  interface Game {
    id: number;
    game_npc: GameNpc[];
  }
  
  export interface UserGame {
    gameId: number;
    Game: Game[];
  }

export const fetchUserGames = async (id: number) => {
    const { data, error } = await supabase
    .from('user_game') // Start from the user_game table to filter by user_id
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
    `)
    .eq('userId', id)
  if (error) {
    throw error;
  }
  const transformedData = data.map((item) => ({
    gameId: item.gameId,
    npcs: item.Game[0].game_npc.map((npc) => ({
      id: npc.Npc[0].id,
      name: npc.Npc[0].name,
    })),
  }));
  return transformedData
};
export type fetchUserGames = QueryData<typeof fetchUserGames>