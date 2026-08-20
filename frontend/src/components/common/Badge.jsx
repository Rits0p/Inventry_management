import React from 'react';

/**
 * Badge – colored status pill.
 *
 * Props:
 *   variant: 'green' | 'red' | 'yellow' | 'blue' | 'indigo' | 'gray' | 'orange'
 *   children: text content
 *   dot (bool): show a leading dot indicator
 */
const variantStyles = {
  green:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  gray:   'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  amber:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const dotColors = {
  green:  'bg-green-500',
  red:    'bg-red-500',
  yellow: 'bg-yellow-500',
  blue:   'bg-blue-500',
  indigo: 'bg-indigo-500',
  gray:   'bg-gray-400',
  orange: 'bg-orange-500',
  amber:  'bg-amber-500',
};

export default function Badge({ variant = 'gray', dot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
