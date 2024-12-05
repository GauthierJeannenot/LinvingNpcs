'use server';

import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import OpenAI from 'openai';
import { Message } from '../types/Messages';
import { Npc } from './fetchGamesAndNpcsFromUser';
import { validateResponse } from '../utils/misc';
import { NPCResponse } from '../types/NpcResponse';
const openai = new OpenAI();

// export const askChatGpt = async (
//   npc: Npc,
//   messages: Message[],
//   previousNpcName?: string, // Nom du NPC précédent, optionnel
// ) => {
//   try {
//     const systemContent = previousNpcName
//       ? `${npc.personae}\nLe joueur arrive après avoir parlé avec ${previousNpcName}.`
//       : npc.personae;

//     const payload: ChatCompletionMessageParam[] = [
//       { role: 'system', content: systemContent },
//       ...(messages as ChatCompletionMessageParam[]),
//     ];

//     const response = await openai.chat.completions.create({
//       model: 'gpt-4', // ou 'gpt-3.5-turbo'
//       messages: payload,
//       temperature: 1.0,
//     });

//     return {
//       role: 'assistant',
//       content: response.choices[0]?.message?.content ?? '',
//     };
//   } catch (error) {
//     console.error('Error with the OpenAI API:', error);
//     throw new Error('Failed to fetch ChatGPT response');
//   }
// };

export const askChatGpt = async (
  npc: Npc, // Le NPC actuel
  messages: Message[], // Messages échangés avec le joueur
  previousNpcName?: string, // NPC précédent, si applicable
): Promise<NPCResponse> => {
  try {
    // Construit le contexte pour ChatGPT
    const systemContent = previousNpcName
      ? `${npc.personae}\nLe joueur arrive après avoir parlé avec ${previousNpcName}. Réponds dans un format JSON structuré.`
      : `${npc.personae}\nRéponds dans un format JSON structuré.`;

    // Charge utile pour l'API OpenAI
    const payload: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      {
        role: 'system',
        content: `
          Réponds toujours dans ce format JSON :
          {
            "intention": "quest" | "item" | "redirection" | "none",
            "details": {
              "quest_name": "string" | null,
              "item_name": "string" | null,
              "npc_name": "string" | null,
              "reason": "string" | null
            },
            "message": "string"
          }`,
      },
      ...(messages as ChatCompletionMessageParam[]),
    ];

    // Appel à l'API OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: payload,
      temperature: 1.0,
    });
    console.log(response);

    const content = response.choices[0]?.message?.content ?? '';
    console.log(content);
    // Validation et parsing de la réponse
    const parsedResponse = JSON.parse(content);
    if (!validateResponse(parsedResponse)) {
      throw new Error('Invalid response format');
    }

    return parsedResponse as NPCResponse;
  } catch (error) {
    console.error('Error with the OpenAI API:', error);
    throw new Error('Failed to fetch ChatGPT response');
  }
};

export const transcribeAudioBase64 = async (base64Audio: string) => {
  try {
    const buffer = Buffer.from(base64Audio, 'base64');

    const file = new File([buffer], 'audio.webm', { type: 'audio/webm' });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return response.text;
  } catch (error) {
    console.error('Error with the OpenAI transcription API:', error);
    throw error;
  }
};
