import { Messages } from '@/lib/types/Messages';

export const ChatWindow = ({
  messages,
  npcName,
}: {
  messages: Messages;
  npcName: string;
}) => {
  return (
    <div className="w-full h-full rounded-lg border-2 border-blue-500 p-4 bg-white shadow-xl">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
        >
          <div
            className={`text-sm font-semibold mb-1 ${
              message.role === 'user' ? 'text-blue-600' : 'text-indigo-600'
            }`}
          >
            {message.role === 'user' ? 'Vous' : npcName}
          </div>
          <div
            className={`inline-block p-3 rounded-lg max-w-[70%] ${
              message.role === 'user'
                ? 'bg-blue-400 text-white rounded-tl-none shadow-md'
                : 'bg-indigo-400 text-white rounded-tr-none shadow-md'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
