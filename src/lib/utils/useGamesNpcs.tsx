import { useEffect, useState } from 'react';
import { fetchUserGames } from '../api/fetchUserGames';
import { UserGames } from '../types/Game';
import { UserNpcs } from '../types/Npc';
import { fetchGamesNpcs } from '../api/fetchGamesNpcs';

export const useGamesNpcs = (id: number) => {
  const [userGames, setUserGames] = useState<number[]>([]);
  const [gameNpcs, setGameNpcs] = useState<UserNpcs[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setUserGames(await fetchUserGames(id));
    };
    fetchData();
  }, []);

  return userGames;
};
