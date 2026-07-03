// Re-export utility functions from lib/utils for path flexibility
export * from '@/lib/utils';

/**
 * Format a date string to a human-readable format.
 * @param dateStr ISO date string (YYYY-MM-DD)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
