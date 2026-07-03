import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export default function Card({ className, children, hoverEffect = true, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white border border-border rounded-card overflow-hidden transition-all duration-300 shadow-soft',
        hoverEffect && 'hover:shadow-hover hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
