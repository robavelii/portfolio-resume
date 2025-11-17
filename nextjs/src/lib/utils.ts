import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function formatDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  
  const years = endYear - startYear;
  const months = endMonth - startMonth;
  
  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;
  
  const yearCount = Math.floor(totalMonths / 12);
  const monthCount = totalMonths % 12;
  
  const yearText = yearCount > 0 ? `${yearCount} ${yearCount === 1 ? 'yr' : 'yrs'}` : '';
  const monthText = monthCount > 0 ? `${monthCount} ${monthCount === 1 ? 'mo' : 'mos'}` : '';
  
  return [yearText, monthText].filter(Boolean).join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization to prevent XSS
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/g, '')
    .replace(/on\w+\s*=\s*'[^']*'/g, '')
    .replace(/javascript:/gi, '');
}