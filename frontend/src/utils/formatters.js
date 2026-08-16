// formatters.js – Common formatting utilities used across the app

/**
 * Format a number as Indian Rupees.
 * Example: 29990 → "₹29,990"
 */
export const formatINR = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Format a JS Date or ISO string as a readable date.
 * Example: "2026-08-15T10:24:00Z" → "15 Aug 2026"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a JS Date or ISO string as date + time.
 * Example: "2026-08-15T10:24:00Z" → "15 Aug 2026, 10:24 AM"
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Truncate a string to a max character length, adding "..." if truncated.
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

/**
 * Convert a string to a URL-friendly slug.
 * Example: "Home & Kitchen" → "home-kitchen"
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Compute the discounted price from original price and discount percentage.
 */
export const applyDiscount = (originalPrice, discountPercent) => {
  return Math.round(originalPrice * (1 - discountPercent / 100));
};
