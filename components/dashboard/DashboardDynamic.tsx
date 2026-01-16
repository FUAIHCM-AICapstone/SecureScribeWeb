'use client';

import React, { Suspense, lazy } from 'react';
import { DashboardSkeleton } from './DashboardSkeleton';
const Dashboard = lazy(() => import('./Dashboard'));

/**
 * Dynamic Dashboard wrapper with Suspense boundary
 * Loads Dashboard, ChartSection, StatsGrid only when needed
 * Saves ~78 KiB on initial page load
 */
export const DashboardDynamic = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
};

export default DashboardDynamic;
