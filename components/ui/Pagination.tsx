import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={cn('flex items-center justify-center space-x-2', className)} aria-label="Pagination">
      {/* Prev Button */}
      <Button
        variant="outline"
        className="p-3 rounded-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'w-12 h-12 flex items-center justify-center font-heading font-semibold text-small rounded-btn border transition-all duration-300 cursor-pointer',
            currentPage === page
              ? 'bg-primary text-white border-primary shadow-soft'
              : 'border-border text-paragraph bg-white hover:border-heading hover:text-heading'
          )}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        className="p-3 rounded-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </nav>
  );
}
