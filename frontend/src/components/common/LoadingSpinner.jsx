
/**
 * LoadingSpinner – full-page or inline loading indicator.
 *
 * Props:
 *   fullPage (bool) – center spinner in the entire viewport
 *   size     (sm | md | lg) – spinner size
 *   label    (string) – accessible label text
 */
export default function LoadingSpinner({
  fullPage = false,
  size = 'md',
  label = 'Loading...',
}) {
  const sizeClass = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-4',
    lg: 'w-14 h-14 border-4',
  }[size];

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClass} rounded-full border-gray-200 border-t-[#2874F0] animate-spin`}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-[var(--text-secondary)]">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#0e0e14]/80">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
