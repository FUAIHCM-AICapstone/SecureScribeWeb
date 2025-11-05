'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import type { ChatMessageResponse } from 'types/chat.type';
import { ChatWelcome } from './ChatWelcome';
import { MessagesContainer } from './MessageContainer';


interface ChatInterfaceProps {
  activeConversationId: string | null;
  messages: ChatMessageResponse[];
  isLoading?: boolean;
  isTyping: boolean;
  isAIResponding?: boolean;
  error: string | null;
  onOpenMobileSidebar: () => void;
}

export function ChatInterface({
  activeConversationId,
  messages,
  isTyping,
  isAIResponding = false,
  error,
  isLoading = false,
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
      backgroundColor: undefined
    }}>
      {/* Messages Area */}
      <MessagesContainer
        messages={messages}
        isTyping={isTyping}
        isAIResponding={isAIResponding}
        error={error}
        typingText={t('typing')}
        aiRespondingText={t('aiResponding')}
        noMessagesText={t('noMessages')}
        startConversationText={t('startConversation')}
        isLoading={isLoading}
      />
    </div>
  );
}
