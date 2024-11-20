import { useEffect, useState } from 'react';
import {
  GameData,
  fetchGamesAndNpcsFromUser,
} from '../api/fetchGamesAndNpcsFromUser';

export const useGamesAndNpcsFromUser = (id: number) => {
  const [userGamesAndNpcs, setUserGamesAndNpcs] = useState<GameData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setUserGamesAndNpcs(await fetchGamesAndNpcsFromUser(id));
    };
    fetchData();
  }, []);

  return userGamesAndNpcs;
};
