'use client';

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
    <div className="p-4 border-t border-[#e1e1e1] bg-white sticky bottom-0 z-[5] flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-full">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={!canSendMessage ? "" : placeholder}
          disabled={!canSendMessage}
          rows={1}
          className="flex-1 p-3 border border-[#d1d1d1] rounded-lg text-sm font-sans resize-none min-h-[44px] max-h-[120px] outline-none focus:border-[#0078d4] transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || !canSendMessage}
          className="min-w-[44px] h-11 px-3 inline-flex items-center justify-center gap-2 rounded-md bg-[#0078d4] hover:bg-[#106ebe] text-white disabled:opacity-50"
          aria-label="Send message"
        >
          <Send24Regular />
          {!isLoading && 'Send'}
        </button>
      </form>
    </div>
  );
}
