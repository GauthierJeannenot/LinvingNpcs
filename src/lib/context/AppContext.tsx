'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  GameData,
  fetchGamesAndNpcsFromUser,
} from '../api/fetchGamesAndNpcsFromUser';

interface AppContextProps {
  gameData: GameData[];
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId: number;
}) => {
  const [gameData, setGameData] = useState<GameData[]>([]);

  useEffect(() => {
    const fetchGameData = async () => {
      setGameData(await fetchGamesAndNpcsFromUser(userId));
    };
    fetchGameData();
  }, [userId]);

  return (
    <AppContext.Provider value={{ gameData }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
