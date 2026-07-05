'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, containerClassName, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] font-heading font-semibold text-heading"
          >
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}
        
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-white border border-border text-[15px] text-heading rounded-xl transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-paragraph/40 disabled:bg-light-gray disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />

        {error && (
          <span className="text-[13px] font-medium text-rose-500 flex items-center gap-1">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span className="text-[12px] text-paragraph font-normal">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
