import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EmptyState – placeholder shown when a list or section has no data.
 *
 * Props:
 *   icon       (string)  – emoji or icon character
 *   title      (string)  – heading text
 *   message    (string)  – supporting text
 *   actionLabel(string)  – CTA button label
 *   actionTo   (string)  – react-router Link target (if internal)
 *   onAction   (fn)      – onClick handler (if not a link)
 */
export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  message = '',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm p-12 text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{message}</p>}

      {actionLabel && (
        <div className="mt-6">
          {actionTo ? (
            <Link
              to={actionTo}
              className="inline-flex px-6 py-2.5 bg-[#FB641B] hover:bg-[#e55a15] text-white font-medium rounded-sm transition text-sm"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex px-6 py-2.5 bg-[#2874F0] hover:bg-blue-700 text-white font-medium rounded-sm transition text-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
