import Badge from '../common/Badge';

/**
 * CategoryCard – admin category row with edit/delete actions.
 *
 * Props:
 *   category  { id, name, slug, products, status, createdAt }
 *   onEdit    (fn) – called with category
 *   onDelete  (fn) – called with category
 */
export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm hover:shadow-md transition">
      {/* Info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#2874F0]/10 text-[#2874F0] flex items-center justify-center font-bold text-lg flex-shrink-0">
          {category.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{category.name}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            slug: <span className="font-mono">{category.slug}</span> •{' '}
            {category.products} products
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-xs text-[var(--text-secondary)] hidden sm:block">{category.createdAt}</div>
        <Badge variant={category.status === 'Active' ? 'green' : 'gray'}>
          {category.status}
        </Badge>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(category)}
            className="px-3 py-1.5 text-sm font-medium text-[#2874F0] border border-[#2874F0] rounded-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(category)}
            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30 rounded-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
