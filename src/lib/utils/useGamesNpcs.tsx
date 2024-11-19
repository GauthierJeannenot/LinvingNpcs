import { useEffect, useState } from 'react';
import { UserGame, fetchUserGames } from '../api/fetchUserGames';
import { UserNpcs } from '../types/Npc';
import { fetchGamesNpcs } from '../api/fetchGamesNpcs';

export const useGamesNpcs = (id: number) => {
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [gameNpcs, setGameNpcs] = useState<UserNpcs[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setUserGames(await fetchUserGames(id));
    };
    fetchData();
  }, []);

  return userGames;
};
