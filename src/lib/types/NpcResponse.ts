export type Intention = 'quest' | 'item' | 'redirection' | 'none';

export interface NPCResponseDetails {
  quest_name: string | null;
  item_name: string | null;
  npc_name: string | null;
  reason: string | null;
}

export interface NPCResponse {
  intention: Intention;
  details: NPCResponseDetails;
  message: string;
}
