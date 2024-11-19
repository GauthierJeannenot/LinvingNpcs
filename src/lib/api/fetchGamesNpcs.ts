'use server';

import { supabase } from '../supabase';
import { UserGames } from '../types/Game';
import { UserNpcs } from '../types/Npc';



export const fetchGamesNpcs = async (gameIds: UserGames[]): Promise<UserNpcs[]> => {
  const { data, error } = await supabase
    .from('game_npc')
    .select('Npc (*)')
    .in('game_id', gameIds)


  if (error) {
    throw error;
  }
  console.log(data)
  return data;
};