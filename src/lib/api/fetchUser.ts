'use server';

import { supabase } from '../supabase';
import { User } from '../types/User';

export const fetchUser = async (email: string): Promise<User> => {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
