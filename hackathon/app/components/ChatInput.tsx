"use client";
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (message.trim()) {
        onSendMessage(message.trim());
        setMessage('');
      }
    }
  };

  return (
    <div className="border-t border-[#6159d0]/20 dark:border-gray-600 p-6 bg-white/60 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 p-4 text-lg border border-[#6159d0]/30 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6159d0] focus:border-[#6159d0] bg-white/80 dark:bg-gray-800 dark:text-white placeholder-[#6159d0]/60 dark:placeholder-gray-400 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-8 py-4 bg-[#6159d0] hover:bg-[#4f47b8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:transform-none disabled:shadow-lg cursor-pointer flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
