/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getBrandConfig } from '@/lib/utils/runtimeConfig';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { Checkmark24Regular, Copy24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessageResponse } from 'types/chat.type';
import { MessageCodeBlock } from './MessageCodeBlock';

const useStyles = makeStyles({
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  userBubble: {
    maxWidth: '80%',
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorBrandBackground,
    color: "#fff",
    border: `1px solid ${tokens.colorBrandForeground1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  userMessageInner: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: tokens.spacingHorizontalS,
  },
  userContent: {
    flex: 1,
    minWidth: 0,
  },
  userContentText: {
    marginBottom: tokens.spacingVerticalS,
    lineHeight: 1.5,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  userTimestamp: {
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalS,
    color: "#fff",
    opacity: 0.8,
  },
  assistantMessage: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  assistantHeader: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
  },
  assistantAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorBrandBackgroundInverted,
    overflow: 'hidden',
  },
  assistantLabel: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  assistantTimestamp: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  assistantContent: {
    marginLeft: '44px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  copyButton: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

interface ChatMessageProps {
  message: ChatMessageResponse;
}

export function ChatMessage({
  message,
}: ChatMessageProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [brandLogo, setBrandLogo] = useState('/images/logos/logo.png');
  const tMsg = useTranslations('Chat.Messages');
  const styles = useStyles();

  useEffect(() => {
    try {
      const brandCfg = getBrandConfig();
      setBrandLogo(brandCfg.logo);
    } catch (error) {
      console.warn('Failed to load brand config:', error);
    }
  }, []);

  useEffect(() => {
    console.log("check message in chat messages", message);
  }, [message]);

  // Enhanced debug logging
  if (message.message_type === 'agent') {
    console.log('[ChatMessage] Assistant message analysis:', {
      messageId: message.id,
      contentSnippet: message.content.substring(0, 100) + '...',
      messageTimestamp: message.created_at
    })
  }

  // Helper function to format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString();
  }
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const renderContentWithMentions = (text: string, isUser: boolean) => {
    const parts: Array<string | { name: string }> = []
    const regex = /@\{(meeting|project|file)\}\{([^}]+)\}/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
      const name = match[2].trim()
      parts.push({ name })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return (
      <>
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}>{p}</span>
          ) : (
            <span
              key={i}
              className={
                isUser
                  ? 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/20 text-white text-[0.9em] border border-white/60'
                  : 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[rgba(0,120,212,0.18)] text-[#0b5cad] text-[0.9em] border border-[#5aa0e6]'
              }
            >
              @{p.name}
            </span>
          )
        )}
      </>
    )
  }

  if (message.message_type === 'user') {
    return (
      <div className={styles.userMessage}>
        <div className={styles.userBubble}>
          <div className={styles.userMessageInner}>
            <div className={styles.userContent}>
              <p className={styles.userContentText}>
                {renderContentWithMentions(message.content, true)}
              </p>
              <p className={styles.userTimestamp}>
                {formatTimestamp(message.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className={styles.assistantMessage}>
      {/* Bot Avatar and Timestamp */}
      <div className={styles.assistantHeader}>
        <div className={styles.assistantAvatar}>
          <Image
            src={brandLogo}
            alt="Assistant Logo"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className={styles.assistantLabel}>
          {tMsg('assistantLabel')}
        </span>
        <span className={styles.assistantTimestamp}>
          {formatTimestamp(message.created_at)}
        </span>
      </div>

      {/* Bot Message Content - Enhanced responsive markdown */}
      <div className={styles.assistantContent}>
        <div className="prose prose-sm max-w-none prose-gray dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: (props: any) => {
                const { inline, className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                const codeContent = String(children).replace(/\n$/, '');
                const language = match ? match[1] : 'text';

                // Handle inline code with simple styling
                if (inline) {
                  return (
                    <code
                      style={{
                        backgroundColor: tokens.colorNeutralBackground3,
                        color: tokens.colorNeutralForeground1,
                        paddingLeft: tokens.spacingHorizontalXS,
                        paddingRight: tokens.spacingHorizontalXS,
                        paddingTop: tokens.spacingVerticalXS,
                        paddingBottom: tokens.spacingVerticalXS,
                        borderRadius: tokens.borderRadiusSmall,
                        fontSize: tokens.fontSizeBase300,
                        fontFamily: tokens.fontFamilyMonospace,
                        border: `1px solid ${tokens.colorNeutralStroke1}`,
                        boxShadow: tokens.shadow2,
                      }}
                      {...rest}
                    >
                      {children}
                    </code>
                  );
                }

                // Handle block code with MessageCodeBlock
                return (
                  <MessageCodeBlock
                    code={codeContent}
                    language={language}
                    variant={match ? 'header' : 'floating'}
                  />
                );
              },
              img: (props: any) => (
                <div className="my-4">
                  <Image
                    {...props}
                    alt={props.alt || 'Image'}
                    className="max-w-full h-auto rounded-lg border border-[color:var(--border)] shadow-sm hover:shadow-md transition-shadow duration-200"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                    width={props.width || 600}
                    height={props.height || 400}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {props.alt && (
                    <p className="text-sm text-[color:var(--muted-foreground)] mt-2 italic text-center">
                      {props.alt}
                    </p>
                  )}
                </div>
              ),
              blockquote: (props: any) => (
                <blockquote className="border-l-4 border-[color:var(--primary)] bg-[color:var(--muted)]/30 p-4 my-4 rounded-r-lg">
                  <div className="text-[color:var(--muted-foreground)] text-sm mb-2 font-medium">
                    System Prompt
                  </div>
                  <div className="text-[color:var(--foreground)] italic">
                    {props.children}
                  </div>
                </blockquote>
              ),
              h1: (props: any) => (
                <h1 className="text-2xl font-bold mb-4 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </h1>
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-semibold mb-3 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </h2>
              ),
              h3: (props: any) => (
                <h3 className="text-lg font-medium mb-2 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </h3>
              ),
              ul: (props: any) => (
                <ul className="list-disc pl-6 mb-4 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </ul>
              ),
              ol: (props: any) => (
                <ol className="list-decimal pl-6 mb-4 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </ol>
              ),
              li: (props: any) => (
                <li className="mb-1 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </li>
              ),
              p: (props: any) => (
                <p className="mb-3 leading-relaxed text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </p>
              ),
              a: (props: any) => (
                <a
                  href={props.href}
                  className="text-[color:var(--primary)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {props.children}
                </a>
              ),
              table: (props: any) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-[color:var(--border)] rounded-lg" {...props}>
                    {props.children}
                  </table>
                </div>
              ),
              th: (props: any) => (
                <th className="border border-[color:var(--border)] px-3 py-2 bg-[color:var(--muted)] font-medium text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </th>
              ),
              td: (props: any) => (
                <td className="border border-[color:var(--border)] px-3 py-2 text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </td>
              ),
              strong: (props: any) => (
                <strong className="font-semibold text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </strong>
              ),
              em: (props: any) => (
                <em className="italic text-[color:var(--foreground)]" {...props}>
                  {props.children}
                </em>
              )
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>


        {/* Copy Button */}
        <div className="flex justify-start">
          <Button
            appearance="subtle"
            size="small"
            onClick={() => handleCopyMessage(message.id, message.content)}
            className={styles.copyButton}
          >
            {copiedMessageId === message.id ? (
              <>
                <Checkmark24Regular style={{ marginRight: '4px' }} />
                {tMsg('copied')}
              </>
            ) : (
              <>
                <Copy24Regular style={{ marginRight: '4px' }} />
                {tMsg('copy')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
