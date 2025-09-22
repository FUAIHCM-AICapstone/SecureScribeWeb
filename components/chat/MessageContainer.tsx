'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessages';
import { EmptyChatState } from './EmptyChatState';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  model_used?: string;
  response_time_ms?: string;
  file_attachments?: string[];
}

interface MessagesContainerProps {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  typingText: string;
  noMessagesText: string;
  startConversationText: string;
}

export function MessagesContainer({
  messages,
  isTyping,
  error,
  typingText,
  noMessagesText,
  startConversationText,
}: MessagesContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4"
    >
      {error && (
        <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <EmptyChatState
          noMessagesText={noMessagesText}
          startConversationText={startConversationText}
        />
      ) : (
        <>
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                message={message}
              />
            </div>
          ))}
          {isTyping && (
            <div className="p-3 italic text-[#666] text-sm">
              {typingText}
            </div>
          )}
        </>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
