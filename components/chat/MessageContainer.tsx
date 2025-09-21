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
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {error && (
        <div style={{
          backgroundColor: '#fed7d7',
          border: '1px solid #fc8181',
          color: '#c53030',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
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
            <div style={{
              padding: '12px',
              fontStyle: 'italic',
              color: '#666',
              fontSize: '14px'
            }}>
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
