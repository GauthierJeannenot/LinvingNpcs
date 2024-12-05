// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateResponse = (response: any): boolean => {
  if (!response || typeof response !== 'object') return false;

  // Valide l'intention
  if (
    !response.intention ||
    !['quest', 'item', 'redirection', 'none'].includes(response.intention)
  ) {
    return false;
  }

  // Valide les détails
  const { details } = response;
  if (!details || typeof details !== 'object') return false;

  // Vérifie les champs des détails
  const validDetails =
    'npc_name' in details &&
    (details.npc_name === null || typeof details.npc_name === 'string') &&
    'reason' in details &&
    (details.reason === null || typeof details.reason === 'string');

  if (!validDetails) return false;

  // Vérifie le message
  if (!response.message || typeof response.message !== 'string') return false;

  return true;
};
