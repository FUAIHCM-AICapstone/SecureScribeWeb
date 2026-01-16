// context/ReactQueryProvider.tsx
'use client';

import { ReactNode, Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../lib/queryClient';

interface ReactQueryProviderProps {
  children: ReactNode;
}

// Lazy load devtools only in development to save ~35-45 kB in production
const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
