'use client';

import Image from 'next/image';
import { Text } from '@fluentui/react-components';

interface EmptyChatStateProps {
  noMessagesText: string;
  startConversationText: string;
}

export function EmptyChatState({ noMessagesText, startConversationText }: EmptyChatStateProps) {
  return (
    <div className="text-center text-[#666] mt-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#f3f2f1] rounded-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/logos/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
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
