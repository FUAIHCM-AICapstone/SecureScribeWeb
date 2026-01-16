'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FiLoader } from 'react-icons/fi';

interface LoaderProps {
  fallbackMessage?: string;
}

const Loader: React.FC<LoaderProps> = ({ fallbackMessage = 'Loading...' }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || resolvedTheme === undefined) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1a1a1a] z-50 opacity-100 transition-opacity duration-300">
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .loader-spinner {
            animation: spin 1s linear infinite;
          }
        `}</style>
        <div className="p-4 rounded-full bg-gray-100 dark:bg-[#2a2a2a] shadow-lg loader-spinner">
          <FiLoader className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {fallbackMessage}
        </p>
      </div>
    );
  }

  return null;
};

export default Loader;
