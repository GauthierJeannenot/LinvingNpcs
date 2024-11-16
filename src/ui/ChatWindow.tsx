import { useEffect, useRef } from 'react';
import { Messages } from '@/lib/types/Messages';

export const ChatWindow = ({
  messages,
  npcName,
}: {
  messages: Messages;
  npcName: string;
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full h-full rounded-lg border border-blue-300 p-4 bg-white shadow-xl overflow-y-auto max-h-[500px]">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div className="max-w-[80%]">
            <div
              className={`text-xs font-medium mb-1 ${
                message.role === 'user'
                  ? 'text-blue-700 text-right'
                  : 'text-indigo-700 text-left'
              }`}
            >
              {message.role === 'user' ? 'Vous' : npcName}
            </div>
            <div
              className={`inline-block p-3 rounded-xl max-w-full break-words shadow-sm transition-all transform ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tl-none hover:bg-blue-600'
                  : 'bg-indigo-500 text-white rounded-tr-none hover:bg-indigo-600'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
