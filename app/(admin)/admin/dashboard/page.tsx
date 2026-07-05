import React from 'react';
import { getDashboardStats, getDashboardChartsData } from '@/actions/dashboard';
import DashboardClient from '@/components/admin/DashboardClient';

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch stats and charts data from the database server-side
  const statsRes = await getDashboardStats();
  const chartsRes = await getDashboardChartsData();

  return (
    <DashboardClient
      stats={statsRes.stats}
      chartsData={chartsRes.chartsData}
      recentActivity={statsRes.recentActivity || []}
    />
  );
}
