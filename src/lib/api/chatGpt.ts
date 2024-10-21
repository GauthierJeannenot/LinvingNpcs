'use server'

import Npc from "../types/Npc"
import OpenAI from "openai";

const openai = new OpenAI();


export const askChatGpt = async(npc: Npc, transcript: string) => {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
            messages: [
              {
                role: 'system',
                content: npc.personae
              },
              {
                role: 'user',
                content: transcript
              }
            ],
          });
      
          console.log(response.choices[0].message);
        } catch (error) {
          console.error('Error with the OpenAI API:', error);
        }

}