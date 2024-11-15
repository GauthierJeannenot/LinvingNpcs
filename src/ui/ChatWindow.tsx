import { Messages } from "@/lib/types/Messages"

export const ChatWindow = ({ messages, npcName }: { messages: Messages, npcName: string }) => {

    
    return(
        <div className="w-full h-full rounded-lg border-4 border-blue-500 mt-4 p-2">
            {messages.map(message => {
                return(
                    <div key={message.content} className="mt-2 mb-2">
                        <h3 className={`${message.role === "user" ? "text-right text-white" : "text-left"}`}>{message.role === "user" ? "user" : npcName}</h3>
                        <p className={`${message.role === "user" ? "text-right rounded-lg rounded-tr-none bg-blue-400 text-white" : "text-left rounded-lg bg-indigo-400 rounded-tl-none text-black"} p-1`}>{message.content}</p>
                    </div>
                )
            })}
        </div>
    )
}