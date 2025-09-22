'use client';

import { useEffect } from 'react';
import { ChatWelcome } from './ChatWelcome';
import { useTranslations } from 'next-intl';
import { MessagesContainer } from './MessageContainer';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 185px)',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

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
  onOpenMobileSidebar: () => void;
}

export function ChatInterface({
  conversation,
  activeConversationId,
  messages,
  isTyping,
  error,
}: ChatInterfaceProps) {
  const t = useTranslations('Chat.Interface');
  const styles = useStyles();

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
  if (!conversation && !activeConversationId) {
    return (
      <ChatWelcome
        welcomeTitle={t('welcomeTitle')}
        welcomeDescription={t('welcomeDescription')}
      />
    );
  }

  return (
    <div className={styles.root}>
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
