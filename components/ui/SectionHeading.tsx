import React from 'react';
import { cn } from '@/lib/utils';
import Badge from './Badge';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  badge,
  align = 'center',
  className
}: SectionHeadingProps) {
  return (
    <div 
      className={cn(
        'max-w-3xl mb-12 md:mb-16 flex flex-col',
        align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start',
        className
      )}
    >
      {badge && (
        <Badge variant="primary" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-section-title mb-4 tracking-tight text-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="text-body text-paragraph font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
