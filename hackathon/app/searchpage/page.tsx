"use client";
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    // Create URL parameters with search context
    const params = new URLSearchParams();
    params.append('query', searchQuery);
    
    // Add file information (file names and sizes)
    if (attachments.length > 0) {
      const fileInfo = attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      params.append('files', JSON.stringify(fileInfo));
    }
    
    // Navigate to chat page with search context
    router.push(`/chatpage?${params.toString()}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#ced7f2] dark:bg-gray-900 flex flex-col">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => router.push('/')}
          className="p-3 text-[#6159d0] hover:text-[#4f47b8] dark:text-[#6159d0] dark:hover:text-[#7a72e8] rounded-lg hover:bg-white/50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-[#6159d0] dark:text-white mb-4">
              What part are you looking for?
            </h2>
            <p className="text-2xl text-[#6159d0]/80 dark:text-gray-400">
              Describe your needs and upload any relevant documents
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell us about the part you need, include your vehicle details, license plate, and any specific requirements..."
              className="w-full p-6 text-xl border border-[#6159d0]/30 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-[#6159d0] focus:border-[#6159d0] bg-white/80 dark:bg-gray-800 dark:text-white placeholder-[#6159d0]/60 dark:placeholder-gray-400 transition-colors duration-200"
              rows={5}
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
                isDragging
                  ? 'border-[#6159d0] bg-white/90'
                  : 'border-[#6159d0]/40 hover:border-[#6159d0]/60 bg-white/60 hover:bg-white/80'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <svg className="w-10 h-10 text-[#6159d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xl text-[#6159d0] dark:text-gray-400">
                  Drop files here or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#6159d0] hover:text-[#4f47b8] dark:text-gray-400 dark:hover:text-[#7a72e8] font-medium underline cursor-pointer"
                  >
                    browse
                  </button>
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* File List */}
            {attachments.length > 0 && (
              <div className="mt-6 space-y-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800 rounded-lg border border-[#6159d0]/20 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#6159d0]/10 dark:bg-gray-700 rounded flex items-center justify-center">
                        <div className="text-[#6159d0]">
                          {getFileIcon(file.type)}
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-medium text-[#6159d0] dark:text-white truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-sm text-[#6159d0]/70 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-2 text-[#6159d0]/60 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors duration-200 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="px-12 py-6 bg-[#6159d0] hover:bg-[#4f47b8] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-medium rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:transform-none disabled:shadow-lg cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
