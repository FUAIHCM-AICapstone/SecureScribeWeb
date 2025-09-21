'use client';

import Image from 'next/image';
import { Text } from '@fluentui/react-components';

interface EmptyChatStateProps {
  noMessagesText: string;
  startConversationText: string;
}

export function EmptyChatState({ noMessagesText, startConversationText }: EmptyChatStateProps) {
  return (
    <div style={{ textAlign: 'center', color: '#666', marginTop: '32px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          backgroundColor: '#f3f2f1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <Image
          src="/images/logos/logo.png"
          alt="Logo"
          width={48}
          height={48}
          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
        />
      </div>
      <Text size={500} style={{ display: 'block', marginBottom: '8px' }}>
        {noMessagesText}
      </Text>
      <Text size={300} style={{ display: 'block' }}>
        {startConversationText}
      </Text>
    </div>
  );
}
