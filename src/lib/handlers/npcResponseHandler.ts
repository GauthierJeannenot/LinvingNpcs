import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NPCResponseDetails } from '../types/NpcResponse';

export function handleQuest(details: NPCResponseDetails) {
  if (details.quest_name) {
    console.log(`Nouvelle quête donnée : ${details.quest_name}`);
    // Exemple : Ajouter au journal des quêtes
    // journal.addQuest(details.quest_name);
  } else {
    console.log('Pas de quête donnée.');
  }
}

export function handleItem(details: NPCResponseDetails) {
  if (details.item_name) {
    console.log(`Objet reçu : ${details.item_name}`);
    // Exemple : Ajouter à l'inventaire
    // inventory.addItem(details.item_name);
  } else {
    console.log("Pas d'objet donné.");
  }
}

export const handleRedirection = (
  details: NPCResponseDetails,
  options: {
    hasGreetedRef: React.MutableRefObject<boolean>;
    router: AppRouterInstance; // Typage du routeur (Next.js par exemple)
  },
) => {
  if (details.npc_name) {
    console.log(`Redirection vers ${details.npc_name}`);
    // Logique pour réinitialiser l'état du prochain NPC
    options.hasGreetedRef.current = false;
    // Redirection avec le routeur
    options.router.push(`/${details.npc_name}`);
  } else {
    console.log('Aucune redirection nécessaire.');
  }
};
