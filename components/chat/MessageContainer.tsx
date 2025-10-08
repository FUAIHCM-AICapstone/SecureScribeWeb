'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessages';
import { EmptyChatState } from './EmptyChatState';
import { makeStyles, tokens } from '@fluentui/react-components';
import type { ChatMessageResponse } from '../../types/chat.type';

const useStyles = makeStyles({
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: tokens.spacingHorizontalM,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  error: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    color: tokens.colorPaletteRedForeground1,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: tokens.spacingVerticalM,
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  typing: {
    padding: tokens.spacingVerticalS,
    fontStyle: 'italic',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
  scrollAnchor: {
    // Empty style for scroll anchor
  },
});


interface MessagesContainerProps {
  messages: ChatMessageResponse[];
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
  const styles = useStyles();
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
      className={styles.container}
    >
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <EmptyChatState
          noMessagesText={noMessagesText}
          startConversationText={startConversationText}
        />
      ) : (
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                message={message}
              />
            </div>
          ))}
          {isTyping && (
            <div className={styles.typing}>
              {typingText}
            </div>
          )}
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} className={styles.scrollAnchor} />
    </div>
  );
}
