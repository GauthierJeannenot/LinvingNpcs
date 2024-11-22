import { Npc } from '../api/fetchGamesAndNpcsFromUser';
import { npcs } from '../data/npc';

interface VoiceType {
  name: string;
  rate: 'slow' | 'medium' | 'fast';
  pitch: 'low' | 'medium' | 'high';
  style: string;
}

type NpcName = (typeof npcs)[number]['name'];

export default interface NpcType {
  name: string;
  lastName: string;
  picture: string;
  connections: ReadonlyArray<NpcName>;
  voice: VoiceType;
  personae: string;
}

export const mapFromNpc = (npc: Npc): NpcType => {
  return {
    name: npc.name,
    lastName: npc.lastName,
    picture: npc.picture,
    connections: [],
    voice: {
      name: npc.voiceName,
      rate: npc.voiceRate as VoiceType['rate'],
      pitch: npc.voicePitch as VoiceType['pitch'],
      style: npc.voiceStyle,
    },
    personae: npc.personae,
  };
};
