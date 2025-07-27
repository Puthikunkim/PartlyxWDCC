import React from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] p-4 rounded-lg ${
              message.sender === 'user'
                ? 'bg-[#6159d0] text-white rounded-br-none shadow-lg'
                : 'bg-white/90 dark:bg-gray-700 text-[#6159d0] dark:text-white rounded-bl-none shadow-lg border border-[#6159d0]/20 dark:border-gray-600'
            }`}
          >
            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
            <p className={`text-xs opacity-70 mt-2 ${
              message.sender === 'user' ? 'text-white/80' : 'text-[#6159d0]/70 dark:text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white/90 dark:bg-gray-700 p-4 rounded-lg rounded-bl-none shadow-lg border border-[#6159d0]/20 dark:border-gray-600">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[#6159d0] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#6159d0] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-[#6159d0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
