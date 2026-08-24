import { useEffect } from 'react';

/**
 * Modal – accessible overlay dialog.
 *
 * Props:
 *   isOpen   (bool)     – controls visibility
 *   onClose  (function) – called when backdrop or × is clicked
 *   title    (string)   – modal heading
 *   children            – modal body content
 *   maxWidth (string)   – Tailwind max-w-* class, default 'max-w-lg'
 *   footer   (node)     – optional footer slot (buttons etc.)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  footer,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60">
      <div
        className={`bg-[var(--card-bg)] backdrop-blur-xl rounded-sm shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)] flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-[var(--card-border)] px-6 py-4 bg-[rgba(128,128,128,0.06)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
