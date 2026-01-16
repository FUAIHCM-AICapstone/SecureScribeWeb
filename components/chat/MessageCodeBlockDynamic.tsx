'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load react-syntax-highlighter only when needed (50+ KiB)
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

interface CodeBlockLoadingProps {
  code?: string;
}

const CodeBlockSkeleton: React.FC<CodeBlockLoadingProps> = ({ code }) => (
  <pre style={{
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '12px',
    color: '#333'
  }}>
    <code>{code || 'Loading code...'}</code>
  </pre>
);

interface MessageCodeBlockDynamicProps {
  code: string;
  language?: string;
  theme?: any;
  className?: string;
}

/**
 * Dynamic Message Code Block wrapper
 * Lazy loads react-syntax-highlighter only when code needs to be highlighted
 * Shows plain code initially, highlights after component loads
 * Saves ~50 KiB on pages without code blocks
 */
export const MessageCodeBlockDynamic: React.FC<MessageCodeBlockDynamicProps> = ({
  code,
  language = 'javascript',
  theme,
  className,
}) => {
  return (
    <Suspense fallback={<CodeBlockSkeleton code={code} />}>
      <SyntaxHighlighter
        language={language}
        style={theme}
        className={className}
        codeTagProps={{
          style: {
            fontSize: '12px',
            fontFamily: 'monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Suspense>
  );
};

export default MessageCodeBlockDynamic;
