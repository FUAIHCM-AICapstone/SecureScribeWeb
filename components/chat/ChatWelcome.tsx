'use client';

import { Text } from '@fluentui/react-components';

interface ChatWelcomeProps {
  welcomeTitle: string;
  welcomeDescription: string;
}

export function ChatWelcome({ welcomeTitle, welcomeDescription }: ChatWelcomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-[linear-gradient(135deg,_#f5f5f5_0%,_#e8e8e8_50%,_#f0f0f0_100%)]">
      <div className="p-8 text-center max-w-[448px] mx-4 bg-white border border-[#e1e1e1] rounded-lg shadow-lg backdrop-blur">
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
