'use client';

import Image from 'next/image';
import { Text } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useState, useEffect } from 'react';
import { getBrandConfig } from '@/lib/utils/runtimeConfig';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalL,
  },
  logo: {
    width: '64px',
    height: '64px',
    marginX: 'auto',
    marginBottom: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    display: 'block',
    marginBottom: tokens.spacingVerticalS,
  },
  subtitle: {
    display: 'block',
  },
});

interface EmptyChatStateProps {
  noMessagesText: string;
  startConversationText: string;
}

export function EmptyChatState({ noMessagesText, startConversationText }: EmptyChatStateProps) {
  const styles = useStyles();
  const [brandLogo, setBrandLogo] = useState('/images/logos/logo.png');

  useEffect(() => {
    try {
      const brandCfg = getBrandConfig();
      setBrandLogo(brandCfg.logo);
    } catch (error) {
      console.warn('Failed to load brand config:', error);
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <Image
          src={brandLogo}
          alt="Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      </div>
      <Text size={500} className={styles.title}>
        {noMessagesText}
      </Text>
      <Text size={300} className={styles.subtitle}>
        {startConversationText}
      </Text>
    </div>
  );
}
