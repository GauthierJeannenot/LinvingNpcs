'use server';

import { supabase } from '../supabase';
import NpcType from '../types/Npc';

export type Npc = {
  created_at: string;
  id: number;
  name: string;
  lastName: string;
  connections: string[];
  picture: string;
  voiceName: string;
  voiceRate: string;
  voicePitch: string;
  voiceStyle: string;
  personae: string;
};

export const mapFromNpcType = (npc: NpcType): Npc => {
  return {
    created_at: '',
    id: 0,
    connections: npc.connections as string[],
    name: npc.name,
    lastName: npc.lastName,
    picture: npc.picture,
    voiceName: npc.voice.name,
    voiceRate: npc.voice.rate,
    voicePitch: npc.voice.pitch,
    voiceStyle: npc.voice.style,
    personae: npc.personae,
  };
};

export type GameData = {
  gameId: number | null;
  npcs: Npc[];
};

export const fetchGamesAndNpcsFromUser = async (
  userId: number,
): Promise<GameData[]> => {
  const { data, error } = await supabase
    .from('user_game')
    .select(
      `
      gameId,
      Game (
        game_npc (
          Npc (*)
        )
      )
    `,
    )
    .eq('userId', userId);

  if (error) {
    console.error('Error fetching games and NPCs:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((item) => {
    const gameId = item.gameId;

    const npcs: Npc[] =
      item.Game?.game_npc.map((gameNpc) => ({
        created_at: gameNpc.Npc?.created_at || '',
        id: gameNpc.Npc?.id || 0,
        connections: [],
        name: gameNpc.Npc?.name || '',
        lastName: gameNpc.Npc?.lastName || '',
        picture: gameNpc.Npc?.picture || '',
        voiceName: gameNpc.Npc?.voiceName || '',
        voiceRate: gameNpc.Npc?.voiceRate || '',
        voicePitch: gameNpc.Npc?.voicePitch || '',
        voiceStyle: gameNpc.Npc?.voiceStyle || '',
        personae: gameNpc.Npc?.personae || '',
      })) || [];

    return { gameId, npcs };
  });
};
