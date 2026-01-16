'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Text, makeStyles } from '@fluentui/react-components';
import { ArrowLeft24Regular, Home24Regular } from '@/lib/icons';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--colorNeutralBackground1)',
    padding: '2rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '8rem',
    fontWeight: 'bold',
    color: 'var(--colorBrandForeground1)',
    margin: 0,
  },
  subtitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: 'var(--colorNeutralForeground1)',
    margin: 0,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
});

const NotFoundPage = () => {
  const router = useRouter();
  const styles = useStyles();

  const handleGoBack = () => {
    router.push('/');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Text className={styles.title}>404</Text>
        <Text className={styles.subtitle}>Not Found</Text>
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleGoBack}
            icon={<ArrowLeft24Regular />}
            appearance="primary"
            size="large"
          >
            Quay lại
          </Button>
          <Button
            onClick={handleGoHome}
            icon={<Home24Regular />}
            appearance="secondary"
            size="large"
          >
            Trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
