'use server';

import { supabase } from '../supabase';


export type Npc = {
  created_at: string;
  id: number;
  name: string;
  lastName: string;
  picture: string;
  voiceName: string;
  voiceRate: string;
  voicePitch: string;
  voiceStyle: string;
  personae: string;
  relatedNpcsNames: string[]
};

export type GameData = {
  gameId: number | null;
  gameName: string
  npcs: Npc[];
};

export const fetchGamesAndNpcsFromUser = async (
  userId: number
): Promise<GameData[]> => {
  const { data, error } = await supabase
  .from('user_game')
  .select(`
  gameId,
  Game (
    name,
    game_npc (
      Npc (
        *,
        relatedNpc!relatedNpc_npcId_fkey (
          relatedNpcID
        )
      )
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

  




  const transformedData: GameData[] = await Promise.all(
    data.map(async (item) => {
      const gameId = item.gameId;
      const gameName = item.Game?.name.replace(' ', '_') || ""
  
      const npcs: Npc[] = await Promise.all(
        item.Game?.game_npc.map(async (gameNpc) => {
          const relatedNpcIds = gameNpc.Npc?.relatedNpc.map(r => r.relatedNpcID) || [];
  
          // Fetch related NPC names
          const { data: relatedNpcs, error: relatedError } = await supabase
            .from('Npc')
            .select('name')
            .in('id', relatedNpcIds);
  
          if (relatedError) {
            console.error('Error fetching related NPC names:', relatedError);
          }
  
          const relatedNpcsNames = relatedNpcs?.map(r => r.name) || [];
  
          return {
            created_at: gameNpc.Npc?.created_at || "",
            id: gameNpc.Npc?.id || 0,
            name: gameNpc.Npc?.name || "",
            lastName: gameNpc.Npc?.lastName || "",
            picture: gameNpc.Npc?.picture || "",
            voiceName: gameNpc.Npc?.voiceName || "",
            voiceRate: gameNpc.Npc?.voiceRate || "",
            voicePitch: gameNpc.Npc?.voicePitch || "",
            voiceStyle: gameNpc.Npc?.voiceStyle || "",
            personae: gameNpc.Npc?.personae || "",
            relatedNpcsNames,
          };
        }) || []
      );
  
      return { gameId, gameName, npcs };
    })
  );

  return transformedData

};
