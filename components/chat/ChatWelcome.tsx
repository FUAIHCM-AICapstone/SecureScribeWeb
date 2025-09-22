'use client';

import { Text } from '@fluentui/react-components';
import { makeStyles, tokens } from '@fluentui/react-components';
import Image from 'next/image';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  container: {
    padding: tokens.spacingHorizontalL,
    textAlign: 'center',
    maxWidth: '448px',
    margin: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
  },
  title: {
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground1,
    display: 'block',
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
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
});

interface ChatWelcomeProps {
  welcomeTitle: string;
  welcomeDescription: string;
}

export function ChatWelcome({ welcomeTitle, welcomeDescription }: ChatWelcomeProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src="/images/logos/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
        </div>
        <Text
          as="h2"
          size={700}
          weight="semibold"
          className={styles.title}
        >
          {welcomeTitle}
        </Text>
        <Text className={styles.subtitle}>
          {welcomeDescription}
        </Text>
      </div>
    </div>
  );
}
