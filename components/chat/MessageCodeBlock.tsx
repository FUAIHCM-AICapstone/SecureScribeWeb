'use client';

import { Button } from '@fluentui/react-components';
import { ArrowDownload24Regular, Checkmark24Regular, Copy24Regular } from '@fluentui/react-icons';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslations } from 'next-intl';

interface MessageCodeBlockProps {
  code: string;
  language: string;
  variant?: 'header' | 'floating' | 'inline';
}

export function MessageCodeBlock({
  code,
  language,
  variant = 'header'
}: MessageCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const tCode = useTranslations('Chat.CodeBlock');


  // Map common language names to file extensions
  const getFileExtension = (lang: string): string => {
    const extensionMap: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      'c++': 'cpp',
      c: 'c',
      csharp: 'cs',
      'c#': 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      scala: 'scala',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sass: 'sass',
      less: 'less',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      yml: 'yml',
      markdown: 'md',
      sql: 'sql',
      bash: 'sh',
      shell: 'sh',
      powershell: 'ps1',
      dockerfile: 'dockerfile',
      tsx: 'tsx',
      jsx: 'jsx'
    };
    return extensionMap[lang.toLowerCase()] || 'txt';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code block:', err);
    }
  };

  const handleDownload = () => {
    try {
      const extension = getFileExtension(language);
      const fileName = `code.${extension}`;
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download code:', err);
    }
  };
  if (variant === 'header') {
    return (
      <>
        <div className="contain-inline-size rounded-md border border-[color:var(--border)] relative bg-[color:var(--card)] my-4 w-full max-w-full overflow-hidden">
          {/* Header with language and actions */}
          <div className="flex items-center text-[color:var(--muted-foreground)] px-4 py-2 text-xs font-sans justify-between h-9 bg-[color:var(--card)] dark:bg-[color:var(--muted)] select-none rounded-t border-b border-[color:var(--border)]">
            <span className="font-medium">{language}</span>
            <div className="flex items-center gap-1">
              <Button
                appearance="subtle"
                size="small"
                onClick={handleDownload}
                style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 12px', fontSize: '12px' }}
              >
                <ArrowDownload24Regular style={{ width: '12px', height: '12px' }} />
                {tCode('download')}
              </Button>
              <Button
                appearance="subtle"
                size="small"
                onClick={handleCopy}
                style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 12px', fontSize: '12px' }}
              >
                {copied ? (
                  <>
                    <Checkmark24Regular style={{ width: '12px', height: '12px' }} />
                    {tCode('copied')}
                  </>
                ) : (
                  <>
                    <Copy24Regular style={{ width: '12px', height: '12px' }} />
                    {tCode('copy')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Code content with syntax highlighting */}
          <div className="overflow-y-auto" dir="ltr">
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{ margin: 0, padding: '1rem', background: 'rgba(0,0,0,0.05)', fontSize: '14px', lineHeight: '1.5' }}
              showLineNumbers={true}
              wrapLines={true}
              codeTagProps={{
                style: {
                  background: 'transparent',
                  backgroundColor: 'transparent'
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>

      </>
    );
  }

  if (variant === 'floating') {
    return (
      <div className="contain-inline-size rounded-md border border-[color:var(--border)] relative bg-[color:var(--muted)] my-4 w-full max-w-full overflow-hidden group">
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '14px', lineHeight: '1.5' }}
            showLineNumbers={false}
            wrapLines={true}
            codeTagProps={{
              style: {
                background: 'transparent',
                backgroundColor: 'transparent'
              }
            }}
          >
            {code}
          </SyntaxHighlighter>

          {/* Floating action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
            <Button
              appearance="subtle"
              size="small"
              onClick={handleDownload}
              style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e1e1e1', padding: '4px 8px' }}
            >
              <ArrowDownload24Regular style={{ width: '12px', height: '12px' }} />
            </Button>
            <Button
              appearance="subtle"
              size="small"
              onClick={handleCopy}
              style={{ fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e1e1e1', padding: '4px 8px', display: 'flex', gap: '4px', alignItems: 'center' }}
            >
              {copied ? (
                <>
                  <Checkmark24Regular style={{ width: '12px', height: '12px' }} />
                  {tCode('copied')}
                </>
              ) : (
                <>
                  <Copy24Regular style={{ width: '12px', height: '12px' }} />
                  {tCode('copy')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <>
      <div className="contain-inline-size rounded border border-[color:var(--border)] bg-[color:var(--muted)] my-2 relative overflow-hidden group">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{ margin: 0, padding: '0.75rem', background: 'transparent', fontSize: '13px', lineHeight: '1.4' }}
          showLineNumbers={false}
          wrapLines={true}
          codeTagProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent'
            }
          }}
        >
          {code}
        </SyntaxHighlighter>

        {/* Action buttons for inline variant */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <Button
            appearance="subtle"
            size="small"
            onClick={handleDownload}
            style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.8)' }}
          >
            <ArrowDownload24Regular style={{ width: '12px', height: '12px' }} />
          </Button>
          <Button
            appearance="subtle"
            size="small"
            onClick={handleCopy}
            style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: 'rgba(255,255,255,0.8)' }}
          >
            {copied ? (
              <Checkmark24Regular style={{ width: '12px', height: '12px' }} />
            ) : (
              <Copy24Regular style={{ width: '12px', height: '12px' }} />
            )}
          </Button>
        </div>
      </div>

    </>
  );
}
