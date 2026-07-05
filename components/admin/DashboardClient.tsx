'use client';

import React from 'react';
import { Users, Compass, Package, Calendar, Clock, Activity, ArrowUpRight } from 'lucide-react';
import DashboardCharts from './DashboardCharts';

interface DashboardClientProps {
  stats: {
    totalUsers: number;
    totalPackages: number;
    totalDestinations: number;
    totalBookings: number;
  };
  chartsData: any[];
  recentActivity: any[];
}

export default function DashboardClient({
  stats,
  chartsData,
  recentActivity,
}: DashboardClientProps) {
  
  // Quick cards metadata
  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      change: '+12% this month',
      icon: Users,
      color: 'bg-teal-50 text-primary border-teal-100',
    },
    {
      label: 'Total Packages',
      value: stats.totalPackages,
      change: '+4 new tours',
      icon: Package,
      color: 'bg-amber-50 text-secondary border-amber-100',
    },
    {
      label: 'Total Destinations',
      value: stats.totalDestinations,
      change: '+1 added recently',
      icon: Compass,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      change: '+28% vs last month',
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading font-extrabold text-[26px] text-heading">
          Welcome to VistaLuxe Admin
        </h1>
        <p className="text-[14px] text-paragraph">
          Monitor your luxury agency statistics, package listings, and editor activity logs.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-border p-6 rounded-xl shadow-soft hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold text-paragraph uppercase tracking-wider">
                  {card.label}
                </span>
                <span className="text-[28px] font-heading font-extrabold text-heading leading-none">
                  {card.value}
                </span>
                <span className="text-[12px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {card.change}
                </span>
              </div>

              <div className={`p-3.5 border rounded-xl ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts widgets */}
      <DashboardCharts data={chartsData} />

      {/* Bottom Grid: Recent Activity logs */}
      <div className="grid grid-cols-1 gap-6 w-full mt-2">
        <div className="bg-white border border-border p-6 rounded-xl shadow-soft flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-heading text-[16px]">Recent Activity Logs</h3>
          </div>

          <div className="flex flex-col gap-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-6 text-paragraph/50 text-[14px]">
                No recent activity logged. Seeding the database will populate logs.
              </div>
            ) : (
              recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 hover:bg-light-gray/40 border border-border/30 rounded-xl transition-all"
                >
                  <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <p className="text-[14px] font-semibold text-heading truncate">
                        {log.action}
                      </p>
                      <span className="text-[12px] text-paragraph font-normal">
                        {new Date(log.time).toLocaleDateString()} at{' '}
                        {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[13px] text-paragraph mt-1">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-bold text-primary bg-teal-50 px-2 py-0.5 rounded">
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-paragraph/60 font-semibold uppercase tracking-wider">
                        {log.userRole}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
