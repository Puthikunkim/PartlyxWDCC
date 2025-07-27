"use client";
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

interface ChatBotProps {
  initialQuery?: string | null;
  initialFiles?: FileInfo[];
}

const ChatBot: React.FC<ChatBotProps> = ({ initialQuery, initialFiles }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Auto-mate. I\'m here to help you find the perfect automotive parts. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial query and files when component mounts
  useEffect(() => {
    if (initialQuery) {
      // Add the initial search query as a user message
      addMessage(initialQuery, 'user');
      
      // Create a response message that acknowledges the search
      let responseText = `I understand you're looking for: "${initialQuery}"`;
      
      if (initialFiles && initialFiles.length > 0) {
        responseText += `\n\nI can see you've uploaded ${initialFiles.length} file(s):`;
        initialFiles.forEach(file => {
          responseText += `\n• ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        });
        responseText += '\n\nLet me help you find the right part. Could you provide more details about your vehicle make, model, and year?';
      } else {
        responseText += '\n\nCould you provide more details about the part you need, including your vehicle make, model, and year?';
      }
      
      // Add bot response after a short delay
      setTimeout(() => {
        addMessage(responseText, 'bot');
      }, 1000);
    }
  }, [initialQuery, initialFiles]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    setIsLoading(true);

    // Simulate bot response (you can replace this with actual AI/bot logic)
    setTimeout(() => {
      const botResponses = [
        "I understand your needs. Let me search our database for the best matches.",
        "That's helpful information! I'm looking for parts that match your requirements.",
        "Great! I can help you find that part. Let me check our inventory.",
        "Perfect! I'll help you locate the right part for your vehicle.",
        "Thanks for the details. I'm searching for the best options available."
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      addMessage(randomResponse, 'bot');
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Quick Actions */}
      <QuickActions onActionClick={handleQuickAction} />

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatBot;
