'use client';

import { Send24Regular } from '@fluentui/react-icons';
import { useEffect, useRef, useState } from 'react';
import MentionSuggestions from '@/components/mentions/MentionSuggestions';
import useMentionInput from '@/components/mentions/useMentionInput';
import { serializeContenteditableToText, parseTokensFromText, createMentionChip } from '@/components/mentions/tokenUtils';
import { searchMentions } from '@/services/api/mock';
import { makeStyles, tokens } from '@fluentui/react-components';
import type { ChatMessageCreate, Mention } from '../../types/chat.type';

const useStyles = makeStyles({
  root: {
    padding: tokens.spacingHorizontalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    bottom: 0,
    zIndex: 5,
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalS,
    alignItems: 'end',
    maxWidth: '100%',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  editor: {
    minHeight: '44px',
    maxHeight: '200px',
    overflow: 'auto',
    padding: tokens.spacingHorizontalS,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    fontFamily: tokens.fontFamilyBase,
    outlineStyle: 'none',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  placeholder: {
    position: 'absolute',
    left: tokens.spacingHorizontalS,
    top: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    pointerEvents: 'none',
  },
  sendButton: {
    minWidth: '44px',
    height: '44px',
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: tokens.spacingHorizontalXS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: 'white',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
    '&:disabled': {
      opacity: 0.5,
    },
  },
});

interface MessageInputProps {
  onSendMessage: (payload: ChatMessageCreate) => void;
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
  const styles = useStyles();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const mention = useMentionInput({
    editorRef,
    search: (q: string) => searchMentions(q, 8),
    limit: 8,
  });

  const updateEmpty = () => {
    const el = editorRef.current;
    if (!el) return;
    const text = el.innerText.replace(/\u200b/g, '').trim();
    setIsEmpty(text.length === 0 && el.querySelectorAll('[data-mention-id]').length === 0);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const el = editorRef.current;
    if (!el) return;
    const text = e.clipboardData.getData('text/plain');
    const tokens = parseTokensFromText(text);
    if (tokens.length === 0) return; // allow default paste
    e.preventDefault();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    let cursor = range;
    tokens.forEach((t) => {
      const mention: Mention = {
        entity_type: t.mention.entity_type,
        entity_id: t.mention.entity_id,
        offset_start: 0,
        offset_end: 0
      };
      const chip = createMentionChip(mention);
      cursor.insertNode(chip);
      const space = document.createTextNode(' ');
      chip.after(space);
      const r = document.createRange();
      r.setStartAfter(space);
      r.collapse(true);
      cursor = r;
    });
    sel.removeAllRanges();
    sel.addRange(cursor);
    updateEmpty();
  };

  const removeAdjacentChipIfAny = (direction: 'backward' | 'forward'): boolean => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return false;
    const node = sel.anchorNode as Node;
    const offset = sel.anchorOffset;
    const isText = node.nodeType === Node.TEXT_NODE;
    const parent = node.parentElement as HTMLElement | null;

    if (direction === 'backward') {
      if (isText && offset > 0) return false; // normal deletion
      const prev = (isText ? (node.previousSibling || parent?.previousSibling) : (node.previousSibling)) as HTMLElement | null;
      if (prev && (prev as HTMLElement).dataset && (prev as HTMLElement).dataset.mentionId && (prev as HTMLElement).dataset.mentionType) {
        // remove optional preceding space
        const before = prev.previousSibling;
        if (before && before.nodeType === Node.TEXT_NODE && (before as Text).data.endsWith(' ')) {
          (before as Text).data = (before as Text).data.slice(0, -1);
        }
        prev.remove();
        updateEmpty();
        return true;
      }
    } else {
      if (isText && node.textContent && offset < node.textContent.length) return false; // normal deletion
      const next = (isText ? (node.nextSibling || parent?.nextSibling) : (node.nextSibling)) as HTMLElement | null;
      if (next && next.dataset && next.dataset.mentionId && next.dataset.mentionType) {
        // remove optional trailing space after chip
        const after = next.nextSibling;
        if (after && after.nodeType === Node.TEXT_NODE) {
          const t = after as Text;
          if (t.data.startsWith(' ')) t.data = t.data.slice(1);
        }
        next.remove();
        updateEmpty();
        return true;
      }
    }
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (mention.actions.onKeyDown(e)) return;
    if (e.key === 'Backspace') {
      if (removeAdjacentChipIfAny('backward')) {
        e.preventDefault();
        return;
      }
    }
    if (e.key === 'Delete') {
      if (removeAdjacentChipIfAny('forward')) {
        e.preventDefault();
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!canSendMessage) return;
      const el = editorRef.current;
      if (!el) return;
      const { content, mentions } = serializeContenteditableToText(el);
      if (!content.trim()) return;
      onSendMessage({
        content,
        mentions: mentions?.map((m: any) => ({
          entity_type: m.type,
          entity_id: m.id,
          offset_start: m.offset,
          offset_end: m.offset + m.length
        })) as Mention[]
      });
      el.innerHTML = '';
      setIsEmpty(true);
    }
  };

  const handleInput = () => {
    mention.actions.onInput();
    updateEmpty();
  };

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => updateEmpty());
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <div className={styles.inputContainer}>
          <div
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            contentEditable={canSendMessage}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            onPaste={handlePaste}
            className={styles.editor}
            data-placeholder={canSendMessage ? placeholder : ''}
            tabIndex={0}
          />
          {isEmpty && canSendMessage && (
            <div className={styles.placeholder}>{placeholder}</div>
          )}
        </div>
        <button
          type="button"
          disabled={!canSendMessage || isEmpty}
          onClick={() => {
            if (!canSendMessage) return;
            const el = editorRef.current;
            if (!el) return;
            const { content, mentions } = serializeContenteditableToText(el);
            if (!content.trim()) return;
            onSendMessage({
              content,
              mentions: mentions?.map((m: any) => ({
                entity_type: m.type,
                entity_id: m.id,
                offset_start: m.offset,
                offset_end: m.offset + m.length
              })) as Mention[]
            });
            el.innerHTML = '';
            setIsEmpty(true);
          }}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <Send24Regular />
          {!isLoading && 'Send'}
        </button>
      </div>
      <MentionSuggestions
        open={mention.state.open}
        position={mention.state.position}
        items={mention.state.items}
        focusedIndex={mention.state.focusedIndex}
        onSelect={(it) => mention.actions.commit(it)}
        onMove={(dir) => mention.actions.setFocusedIndex((i: number) => (dir === 'down' ? i + 1 : i - 1))}
        onClose={() => mention.actions.close()}
        labels={{}}
      />
    </div>
  );
}
