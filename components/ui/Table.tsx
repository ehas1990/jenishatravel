'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface TableProps {
  headers: string[];
  isLoading?: boolean;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export default function Table({
  headers,
  isLoading = false,
  children,
  emptyState,
  pagination,
  onPageChange,
}: TableProps) {
  return (
    <div className="flex flex-col w-full border border-border bg-white rounded-xl overflow-hidden shadow-soft">
      {/* Scrollable Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-light-gray/60 border-b border-border/80">
              {headers.map((h, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-4 select-none text-[14px] font-semibold text-[#374151] tracking-[0.2px] normal-case align-middle font-heading"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="border-b border-border/40 animate-pulse">
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4.5">
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                    </td>
                  ))}
                </tr>
              ))
            ) : React.Children.count(children) === 0 ? (
              // Empty State
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-[15px] font-semibold text-heading">No items found</p>
                      <p className="text-[13px] text-paragraph">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              // Real Table Rows
              children
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border bg-light-gray/20">
          <div className="text-[14px] text-paragraph">
            Showing <span className="font-semibold text-heading">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-heading">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-heading">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 min-h-0 active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              // Show pages around the current page
              if (
                pageNumber === 1 ||
                pageNumber === pagination.totalPages ||
                Math.abs(pageNumber - pagination.page) <= 1
              ) {
                return (
                  <Button
                    key={idx}
                    variant={pagination.page === pageNumber ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="px-3.5 py-1.5 min-h-0 text-[13px]"
                  >
                    {pageNumber}
                  </Button>
                );
              }
              if (
                pageNumber === 2 ||
                pageNumber === pagination.totalPages - 1
              ) {
                return (
                  <span key={idx} className="text-paragraph text-[13px] px-1 select-none">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 min-h-0 active:scale-95 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
