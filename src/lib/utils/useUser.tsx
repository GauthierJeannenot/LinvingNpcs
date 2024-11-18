import { useEffect, useState } from 'react';
import { fetchUser } from '../api/fetchUser';

export type User = {
  id: number;
  email: string;
  created_at: Date;
};

export const useUser = (email: string) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchData = async () => {
      setUser(await fetchUser(email));
    };
    fetchData();
  }, []);
  return user;
};
