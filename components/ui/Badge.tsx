import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral';
  children: React.ReactNode;
}

export default function Badge({ className, variant = 'primary', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase';
  
  const variants = {
    primary: 'bg-teal-50 text-primary border border-teal-100',
    secondary: 'bg-amber-50 text-secondary border border-amber-100',
    success: 'bg-green-50 text-success border border-green-100',
    danger: 'bg-red-50 text-danger border border-red-100',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-100'
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
