import { useEffect, useState } from 'react';
import { fetchUser } from '../api/fetchUser';
import { User } from '../api/fetchUser';

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
