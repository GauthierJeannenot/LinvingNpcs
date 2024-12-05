import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NPCResponse } from '../types/NpcResponse';
import {
  handleQuest,
  handleItem,
  handleRedirection,
} from './npcResponseHandler';

export function handleNPCResponse(
  response: NPCResponse,
  hasGreetedRef: React.MutableRefObject<boolean>,
  router: AppRouterInstance,
) {
  console.log(`Message du NPC : ${response.message}`);

  switch (response.intention) {
    case 'quest':
      handleQuest(response.details);
      break;
    case 'item':
      handleItem(response.details);
      break;
    case 'redirection':
      handleRedirection(response.details, { hasGreetedRef, router });
      break;
    case 'none':
      console.log('Aucune action nécessaire.');
      break;
    default:
      console.log('Intention inconnue.');
  }
}
