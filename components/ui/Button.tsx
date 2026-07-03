import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-soft',
    secondary: 'bg-secondary text-white hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-soft',
    outline: 'border border-border text-heading bg-transparent hover:border-heading hover:bg-light-gray',
    ghost: 'text-paragraph hover:text-heading hover:bg-light-gray',
    icon: 'p-3 bg-white border border-border text-heading rounded-full hover:border-heading hover:bg-light-gray'
  };

  const sizes = {
    sm: 'text-[14px] px-4 py-2 rounded-btn',
    md: 'text-[16px] px-6 py-3 rounded-btn',
    lg: 'text-[18px] px-8 py-4 rounded-btn',
  };

  const customClass = variant === 'icon' 
    ? cn(baseStyles, variants.icon, className)
    : cn(baseStyles, variants[variant], sizes[size], className);

  return (
    <button className={customClass} {...props}>
      {children}
    </button>
  );
}
