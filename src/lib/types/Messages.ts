import OpenAI from "openai"

export interface Message {
    role: string
    content: string
}

export type Messages = Message[]