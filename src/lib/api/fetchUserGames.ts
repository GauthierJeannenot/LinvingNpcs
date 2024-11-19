'use server';

import { supabase } from '../supabase';
import { supabaseUserGames } from '../types/Game';

export const fetchUserGames = async (id: number): Promise<number[]> => {
    const { data, error } = await supabase
        .from('user_game')
        .select(`Game ( id )`)
        .eq('userId', id)

  if (error) {
    throw error;
  }
  
  return data.map((game) => game.Game[0]?.id)
};