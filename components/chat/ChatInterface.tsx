'use client';

import { useEffect } from 'react';
import { ChatWelcome } from './ChatWelcome';
import { useTranslations } from 'next-intl';
import { MessagesContainer } from './MessageContainer';
import type { ChatMessageResponse } from '../../types/chat.type';


interface ChatInterfaceProps {
  activeConversationId: string | null;
  messages: ChatMessageResponse[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  onOpenMobileSidebar: () => void;
}

export function ChatInterface({
  activeConversationId,
  messages,
  isTyping,
  error,
}: ChatInterfaceProps) {
  const t = useTranslations('Chat.Interface');

  // Note: input moved to ChatClientWrapper; this component renders messages only

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
  if (!activeConversationId) {
    return (
      <ChatWelcome
        welcomeTitle={t('welcomeTitle')}
        welcomeDescription={t('welcomeDescription')}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 185px)',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Messages Area */}
      <MessagesContainer
        messages={messages}
        isTyping={isTyping}
        error={error}
        typingText={t('typing')}
        noMessagesText={t('noMessages')}
        startConversationText={t('startConversation')}
      />
    </div>
  );
}
