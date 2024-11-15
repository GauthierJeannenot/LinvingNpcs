'use server';

import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import OpenAI from 'openai';
import { Message } from '../types/Messages';
import Npc from '../types/Npc';

const openai = new OpenAI();

export const askChatGpt = async (npc: Npc, messages: Message[]) => {
  try {
    console.log(messages);
    const payload: ChatCompletionMessageParam[] = [
      { role: 'system', content: npc.personae },
      ...messages as ChatCompletionMessageParam[],
    ];
    console.log(payload);
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-4' if you have access
      messages: payload,
      temperature: 1.0,
    });
    return {
      role: 'assistant',
      content: response.choices[0].message.content ?? '',
    };
  } catch (error) {
    console.error('Error with the OpenAI API:', error);
  }
};
