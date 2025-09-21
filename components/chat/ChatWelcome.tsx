'use client';

import { Text } from '@fluentui/react-components';

interface ChatWelcomeProps {
  welcomeTitle: string;
  welcomeDescription: string;
}

export function ChatWelcome({ welcomeTitle, welcomeDescription }: ChatWelcomeProps) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%)',
      }}
    >
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          maxWidth: '448px',
          margin: '0 16px',
          backgroundColor: 'white',
          border: '1px solid #e1e1e1',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Text
          as="h2"
          size={700}
          weight="semibold"
          style={{
            marginBottom: '16px',
            background: 'linear-gradient(to right, #0078d4, #106ebe, #005a9e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'block'
          }}
        >
          {welcomeTitle}
        </Text>
        <Text style={{ color: '#666' }}>
          {welcomeDescription}
        </Text>
      </div>
    </div>
  );
}
