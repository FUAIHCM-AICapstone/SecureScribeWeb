'use client';

import { useEffect } from 'react';
import { ChatWelcome } from './ChatWelcome';
import { useTranslations } from 'next-intl';
import { MessagesContainer } from './MessageContainer';
import { MessageInput } from './MessageInput';

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

interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  lastActivity: Date;
  messageCount: number;
}

interface ChatInterfaceProps {
  conversation: Conversation | null;
  activeConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  onOpenMobileSidebar: () => void;
}

export function ChatInterface({
  conversation,
  activeConversationId,
  messages,
  isLoading,
  isTyping,
  error,
  onSendMessage,
}: ChatInterfaceProps) {
  const t = useTranslations('Chat.Interface');

  // Check if user can send messages - block when bot is responding
  const canSendMessage = (): boolean => {
    return Boolean(activeConversationId && !isLoading && !isTyping);
  };

  // Auto scroll when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      // Small delay to ensure messages are rendered
      const timer = setTimeout(() => {
        // Scroll behavior is handled in MessagesContainer
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeConversationId]);

  // If no conversation is selected, show welcome screen
  if (!conversation && !activeConversationId) {
    return (
      <ChatWelcome
        welcomeTitle={t('welcomeTitle')}
        welcomeDescription={t('welcomeDescription')}
      />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f5f5f5]">
      {/* Messages Area */}
      <MessagesContainer
        messages={messages}
        isTyping={isTyping}
        error={error}
        typingText={t('typing')}
        noMessagesText={t('noMessages')}
        startConversationText={t('startConversation')}
      />

      {/* Input Area */}
      <MessageInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        canSendMessage={canSendMessage()}
        placeholder={t('inputPlaceholder')}
      />
    </div>
  );
}
