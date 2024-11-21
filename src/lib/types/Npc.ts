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
