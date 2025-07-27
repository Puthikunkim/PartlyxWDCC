"use client";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    id: number;
    sender: 'user' | 'bot';
    text: string;
    timestamp: Date;
    hasImage?: boolean;
    hasButtons?: boolean;
    imageUrls?: string[];
  }>;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query');
  const filesParam = searchParams.get('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatId, setActiveChatId] = useState('chat-1');

  // Parse file information if present
  let files = [];
  if (filesParam) {
    try {
      files = JSON.parse(filesParam);
    } catch (error) {
      console.error('Error parsing files parameter:', error);
    }
  }

  // Helper to get image URLs from file info (simulate, since we don't have the actual file blobs)
  const getImageUrlsFromFileInfo = (fileInfoArr: any[]) => {
    // In a real app, you'd need to fetch or reconstruct the image URLs from the backend or upload process
    // Here, we just return empty array since we can't reconstruct images from just name/type/size
    return [];
  };

  // Build initial chatSessions based on query and files
  const initialMessages = [];
  if (query) {
    initialMessages.push({
      id: 1,
      sender: 'user' as const,
      text: query,
      timestamp: new Date()
    });
  }
  if (files.length > 0) {
    const imageFiles = files.filter((f: any) => f.type && f.type.startsWith('image/'));
    const otherFiles = files.filter((f: any) => !f.type || !f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      initialMessages.push({
        id: 2,
        sender: 'user' as const,
        text: imageFiles.length === 1 ? 'Uploaded an image:' : `Uploaded ${imageFiles.length} images:`,
        timestamp: new Date(),
        imageUrls: getImageUrlsFromFileInfo(imageFiles)
      });
    }
    if (otherFiles.length > 0) {
      initialMessages.push({
        id: 3,
        sender: 'user' as const,
        text: `Uploaded file${otherFiles.length > 1 ? 's' : ''}: ${otherFiles.map((f: any) => f.name).join(', ')}`,
        timestamp: new Date()
      });
    }
  }
  if (initialMessages.length === 0) {
    initialMessages.push({
      id: 1,
      sender: 'user' as const,
      text: 'I Want door',
      timestamp: new Date()
    });
  }
  initialMessages.push({
    id: 100,
    sender: 'bot' as const,
    text: 'Is this the correct part?',
    timestamp: new Date(),
    hasImage: true,
    hasButtons: true
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      title: initialMessages.find(m => m.sender === 'user')?.text || 'New Chat',
      messages: initialMessages
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedChatId, setDraggedChatId] = useState<string | null>(null);

  const activeChat = chatSessions.find(chat => chat.id === activeChatId) || chatSessions[0];

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleButtonClick = (action: string) => {
    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: Date.now(),
            sender: 'user' as const,
            text: action === 'No' ? 'No, that\'s not the right part' : 'Yes, that\'s the correct part',
            timestamp: new Date()
          }]
        };
      }
      return chat;
    });
    setChatSessions(updatedSessions);
  };

  const addNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [
        {
          id: 1,
          sender: 'bot',
          text: 'Hello! How can I help you find automotive parts today?',
          timestamp: new Date()
        }
      ]
    };
    setChatSessions(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, {
            id: Date.now(),
            sender: 'user' as const,
            text: message,
            timestamp: new Date()
          }]
        };
      }
      return chat;
    });
    setChatSessions(updatedSessions);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    const imageFiles = fileArr.filter(f => f.type.startsWith('image/'));
    const otherFiles = fileArr.filter(f => !f.type.startsWith('image/'));
    const imageUrls = imageFiles.map(f => URL.createObjectURL(f));
    const fileNames = otherFiles.map(f => f.name).join(', ');
    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === activeChatId) {
        let newMessages = [...chat.messages];
        if (imageUrls.length > 0) {
          newMessages.push({
            id: Date.now(),
            sender: 'user' as const,
            text: imageUrls.length === 1 ? 'Uploaded an image:' : `Uploaded ${imageUrls.length} images:`,
            timestamp: new Date(),
            imageUrls
          });
        }
        if (otherFiles.length > 0) {
          newMessages.push({
            id: Date.now() + 1,
            sender: 'user' as const,
            text: `Uploaded file${otherFiles.length > 1 ? 's' : ''}: ${fileNames}`,
            timestamp: new Date()
          });
        }
        return {
          ...chat,
          messages: newMessages
        };
      }
      return chat;
    });
    setChatSessions(updatedSessions);
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragStart = (chatId: string) => {
    setDraggedChatId(chatId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, chatId: string) => {
    e.preventDefault();
    if (draggedChatId === chatId) return;
    const draggedIdx = chatSessions.findIndex(c => c.id === draggedChatId);
    const overIdx = chatSessions.findIndex(c => c.id === chatId);
    if (draggedIdx === -1 || overIdx === -1) return;
    const newChats = [...chatSessions];
    const [removed] = newChats.splice(draggedIdx, 1);
    newChats.splice(overIdx, 0, removed);
    setChatSessions(newChats);
  };

  const handleDragEnd = () => {
    setDraggedChatId(null);
  };

  // Delete chat handler
  const handleDeleteChat = (chatId: string) => {
    let newChats = chatSessions.filter(chat => chat.id !== chatId);
    // If the deleted chat was active, switch to the first chat if any
    if (activeChatId === chatId && newChats.length > 0) {
      setActiveChatId(newChats[0].id);
    } else if (newChats.length === 0) {
      setActiveChatId('');
    }
    setChatSessions(newChats);
  };

  return (
    <div className="flex min-h-screen bg-[#ced7f2] dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-80 bg-white/80 dark:bg-gray-800 border-r border-[#6159d0]/20 dark:border-gray-600 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#6159d0]/20 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#6159d0] dark:text-white">AutoMate</h1>
            <button
              onClick={() => router.push('/searchpage')}
              className="p-2 text-[#6159d0] hover:text-[#4f47b8] dark:text-[#6159d0] dark:hover:text-[#7a72e8] rounded-lg hover:bg-[#6159d0]/10 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#6159d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-3 border border-[#6159d0]/30 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6159d0] focus:border-[#6159d0] bg-white/80 dark:bg-gray-800 dark:text-white placeholder-[#6159d0]/60 dark:placeholder-gray-400 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 p-4 space-y-3">
          {chatSessions
            .filter(chat => 
              searchTerm === '' || 
              (chat.messages.find(msg => msg.sender === 'user')?.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
              chat.messages.some(msg => msg.text.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((chat) => {
              const firstUserMsg = chat.messages.find(msg => msg.sender === 'user');
              return (
                <div 
                  key={chat.id}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 ${
                    activeChatId === chat.id 
                      ? 'bg-[#6159d0]/10 border-[#6159d0] dark:bg-[#6159d0]/20 dark:border-[#6159d0]' 
                      : 'bg-white/60 border-[#6159d0]/20 dark:bg-gray-700 dark:border-gray-600 hover:bg-[#6159d0]/5 dark:hover:bg-gray-600'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(chat.id)}
                  onDragOver={e => handleDragOver(e, chat.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDragEnd}
                >
                  <div className="flex-1 min-w-0 pr-2" onClick={() => handleChatSelect(chat.id)}>
                    <span className="text-[#6159d0] dark:text-white font-medium truncate block">
                      {firstUserMsg ? firstUserMsg.text : 'No user message'}
                    </span>
                  </div>
                  <button
                    className="ml-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    title="Delete chat"
                    onClick={e => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                  >
                    <svg className="w-5 h-5 text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          
          {/* Add New Chat Button */}
          <button
            onClick={addNewChat}
            className="w-full p-4 rounded-lg border border-dashed border-[#6159d0]/40 hover:border-[#6159d0]/60 bg-white/60 hover:bg-[#6159d0]/5 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 text-[#6159d0] dark:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#ced7f2]/50 dark:bg-gray-900">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 ml-2">
                    <div className="w-4 h-4 bg-[#6159d0] rounded-full"></div>
                  </div>
                )}
                <div
                  className={`p-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#6159d0] text-white rounded-br-none'
                      : 'bg-white/90 dark:bg-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-base">{message.text}</p>
                  {message.imageUrls && message.imageUrls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {message.imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="attachment"
                          className="max-w-[180px] max-h-[180px] rounded border border-[#bebde0] bg-[#f4f4fa] object-cover"
                        />
                      ))}
                    </div>
                  )}
                  {message.hasImage && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-[#6159d0]/20">
                      <div className="w-32 h-32 mx-auto flex items-center justify-center">
                        <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {message.hasButtons && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleButtonClick('No')}
                        className="px-6 py-2 bg-[#6159d0] hover:bg-[#4f47b8] text-white rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleButtonClick('Submit')}
                        className="px-6 py-2 bg-[#6159d0] hover:bg-[#4f47b8] text-white rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-[#6159d0]/20 dark:border-gray-600 bg-white/60 dark:bg-gray-800">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter text..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="flex-1 p-4 border border-[#6159d0]/30 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6159d0] focus:border-[#6159d0] bg-white/80 dark:bg-gray-800 dark:text-white placeholder-[#6159d0]/60 dark:placeholder-gray-400 transition-colors duration-200"
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <button type="button" onClick={handleFileUploadClick} className="p-4 text-[#6159d0] hover:text-[#4f47b8] dark:text-[#6159d0] dark:hover:text-[#7a72e8] rounded-lg hover:bg-[#6159d0]/10 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
            <button className="p-4 text-[#6159d0] hover:text-[#4f47b8] dark:text-[#6159d0] dark:hover:text-[#7a72e8] rounded-lg hover:bg-[#6159d0]/10 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

