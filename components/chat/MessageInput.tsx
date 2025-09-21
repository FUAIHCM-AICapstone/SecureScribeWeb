'use client';

import { Button } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useEffect, useRef, useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  canSendMessage: boolean;
  placeholder: string;
}

export function MessageInput({
  onSendMessage,
  isLoading,
  canSendMessage,
  placeholder,
}: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !canSendMessage) return;

    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && canSendMessage) {
        onSendMessage(input.trim());
        setInput('');
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div style={{
      padding: '16px',
      borderTop: '1px solid #e1e1e1',
      backgroundColor: '#ffffff'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
        maxWidth: '100%'
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={!canSendMessage ? "" : placeholder}
          disabled={!canSendMessage}
          rows={1}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #d1d1d1',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            resize: 'none',
            minHeight: '44px',
            maxHeight: '120px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#0078d4'}
          onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}
        />
        <Button
          type="submit"
          disabled={!input.trim() || !canSendMessage}
          appearance="primary"
          icon={<Send24Regular />}
          style={{
            minWidth: '44px',
            height: '44px'
          }}
        >
          {!isLoading && 'Send'}
        </Button>
      </form>
    </div>
  );
}
