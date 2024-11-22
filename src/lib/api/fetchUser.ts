'use server';

import { QueryData } from '@supabase/supabase-js';
import { supabase } from '../supabase';



export type User = {
  created_at: string;
  email: string | null;
  id: number;
}

export const fetchUser = async (email: string) => {
  const { data, error } = await supabase
  .from('User')
  .select('*')
  .eq('email', email)
    
  if (error) {
    throw error;
  }
  return data;
};
export type Users = QueryData<typeof fetchUser>
