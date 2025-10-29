'use client';

import Dashboard from '@/components/dashboard/Dashboard';
import { makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    ...shorthands.padding('40px', '32px', '24px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px', '16px'),
    },
  },
});

export default function DashboardPage() {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Dashboard />
    </div>
  );
}
