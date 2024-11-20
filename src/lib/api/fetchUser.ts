'use server';

import { QueryData } from '@supabase/supabase-js';
import { supabase } from '../supabase';

const user = supabase
  .from('User')
  .select('*')
export type User = QueryData<typeof user>

export const fetchUser = async (email: string) => {
  const { data, error } = await user
    .eq('email', email)
  if (error) {
    throw error;
  }
  return data;
};

