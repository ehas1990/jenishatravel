'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  month: string;
  visitors: number;
  packages: number;
  users: number;
}

interface DashboardChartsProps {
  data: ChartDataPoint[];
}

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<'visitors' | 'joined'>('visitors');

  const padding = 35;
  const width = 600;
  const height = 240;
  
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Max calculations
  const maxVisitors = Math.max(...data.map(d => d.visitors), 1000);
  const maxJoined = Math.max(...data.map(d => Math.max(d.users, d.packages)), 10);

  // Grid coordinates mapping helpers
  const getX = (index: number) => padding + (index * (graphWidth / (data.length - 1)));
  const getY = (value: number, max: number) => height - padding - (value * (graphHeight / max));

  // Construct line path for visitors
  const linePoints = data.map((d, i) => `${getX(i)},${getY(d.visitors, maxVisitors)}`).join(' ');
  
  // Construct area path (filled under line) for visitors
  const areaPoints = `
    ${getX(0)},${height - padding} 
    ${linePoints} 
    ${getX(data.length - 1)},${height - padding}
  `;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
      {/* 1. Monthly Visitors (Interactive Line / Area Chart) */}
      <div className="bg-white border border-border p-6 rounded-xl shadow-soft flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-heading font-bold text-heading text-[16px]">Monthly Website Visitors</h3>
            <p className="text-[12px] text-paragraph mt-0.5">Unique monthly traffic over last 6 months</p>
          </div>
          <span className="text-[13px] font-semibold text-primary px-2.5 py-1 bg-teal-50 rounded-lg">
            +{Math.round(((data[data.length - 1].visitors - data[0].visitors) / data[0].visitors) * 100)}% Traffic
          </span>
        </div>

        {/* SVG Graph */}
        <div className="relative w-full flex-grow min-h-[240px]">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => (
              <line
                key={idx}
                x1={padding}
                y1={padding + graphHeight * val}
                x2={width - padding}
                y2={padding + graphHeight * val}
                className="stroke-slate-100"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area under the line */}
            <polygon points={areaPoints} fill="url(#areaGrad)" />

            {/* Smooth trendline */}
            <polyline
              fill="none"
              stroke="#0F766E"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={linePoints}
            />

            {/* Interactive Tooltip Vertical Line */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                y1={padding}
                x2={getX(hoveredIndex)}
                y2={height - padding}
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* Data nodes */}
            {data.map((d, i) => (
              <g key={i}>
                <circle
                  cx={getX(i)}
                  cy={getY(d.visitors, maxVisitors)}
                  r={hoveredIndex === i ? 6 : 4}
                  fill={hoveredIndex === i ? '#F59E0B' : '#0F766E'}
                  className="stroke-white transition-all duration-150 cursor-pointer"
                  strokeWidth="2.5"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Horizontal X Axis Labels */}
                <text
                  x={getX(i)}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-paragraph text-[11px] font-semibold"
                >
                  {d.month}
                </text>
              </g>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-dark-bg text-white px-3 py-2 rounded-lg text-[12px] shadow-glass border border-white/10 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(getX(hoveredIndex) / width) * 100}%`,
                top: `${(getY(data[hoveredIndex].visitors, maxVisitors) / height) * 100 - 4}%`,
              }}
            >
              <div className="font-semibold text-slate-400">{data[hoveredIndex].month}</div>
              <div className="font-bold text-amber-400 mt-0.5">
                {data[hoveredIndex].visitors.toLocaleString()} Visitors
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Packages Added vs. Users Joined (Interactive Double Bar Chart) */}
      <div className="bg-white border border-border p-6 rounded-xl shadow-soft flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-heading font-bold text-heading text-[16px]">Registrations & Content</h3>
            <p className="text-[12px] text-paragraph mt-0.5">Packages added vs new users joined</p>
          </div>
          
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-heading">
              <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
              Users
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-heading">
              <span className="w-2.5 h-2.5 bg-secondary rounded-sm" />
              Packages
            </span>
          </div>
        </div>

        {/* SVG Graph for Bars */}
        <div className="relative w-full flex-grow min-h-[240px]">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => (
              <line
                key={idx}
                x1={padding}
                y1={padding + graphHeight * val}
                x2={width - padding}
                y2={padding + graphHeight * val}
                className="stroke-slate-100"
                strokeWidth="1"
              />
            ))}

            {data.map((d, i) => {
              // Grouped bar calculations
              const groupCenterX = getX(i);
              const barWidth = 14;
              const spacing = 4;
              
              const bar1X = groupCenterX - barWidth - (spacing / 2);
              const bar2X = groupCenterX + (spacing / 2);
              
              const bar1Y = getY(d.users, maxJoined);
              const bar2Y = getY(d.packages, maxJoined);
              
              const groundY = height - padding;
              
              const bar1Height = groundY - bar1Y;
              const bar2Height = groundY - bar2Y;

              return (
                <g key={i}>
                  {/* Users Joined Bar (Teal) */}
                  <rect
                    x={bar1X}
                    y={bar1Y}
                    width={barWidth}
                    height={bar1Height}
                    rx="4"
                    fill="#0F766E"
                    className="hover:fill-primary-hover transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i + 10)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Packages Added Bar (Amber) */}
                  <rect
                    x={bar2X}
                    y={bar2Y}
                    width={barWidth}
                    height={bar2Height}
                    rx="4"
                    fill="#F59E0B"
                    className="hover:fill-amber-600 transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i + 20)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Horizontal X Axis Labels */}
                  <text
                    x={groupCenterX}
                    y={height - 12}
                    textAnchor="middle"
                    className="fill-paragraph text-[11px] font-semibold"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltips for User registrations */}
          {hoveredIndex !== null && hoveredIndex >= 10 && hoveredIndex < 20 && (
            <div
              className="absolute bg-dark-bg text-white px-3 py-2 rounded-lg text-[12px] shadow-glass border border-white/10 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(getX(hoveredIndex - 10) / width) * 100}%`,
                top: `${(getY(data[hoveredIndex - 10].users, maxJoined) / height) * 100 - 4}%`,
              }}
            >
              <div className="font-semibold text-slate-400">{data[hoveredIndex - 10].month}</div>
              <div className="font-bold text-teal-400 mt-0.5">
                {data[hoveredIndex - 10].users} Users Registered
              </div>
            </div>
          )}

          {/* Floating Tooltips for Package additions */}
          {hoveredIndex !== null && hoveredIndex >= 20 && (
            <div
              className="absolute bg-dark-bg text-white px-3 py-2 rounded-lg text-[12px] shadow-glass border border-white/10 pointer-events-none -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(getX(hoveredIndex - 20) / width) * 100}%`,
                top: `${(getY(data[hoveredIndex - 20].packages, maxJoined) / height) * 100 - 4}%`,
              }}
            >
              <div className="font-semibold text-slate-400">{data[hoveredIndex - 20].month}</div>
              <div className="font-bold text-amber-400 mt-0.5">
                {data[hoveredIndex - 20].packages} Packages Added
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
