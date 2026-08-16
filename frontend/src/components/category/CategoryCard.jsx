import React from 'react';
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition">
      {/* Info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#2874F0]/10 text-[#2874F0] flex items-center justify-center font-bold text-lg flex-shrink-0">
          {category.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{category.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            slug: <span className="font-mono">{category.slug}</span> •{' '}
            {category.products} products
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-xs text-gray-500 hidden sm:block">{category.createdAt}</div>
        <Badge variant={category.status === 'Active' ? 'green' : 'gray'}>
          {category.status}
        </Badge>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(category)}
            className="px-3 py-1.5 text-sm font-medium text-[#2874F0] border border-[#2874F0] rounded-sm hover:bg-blue-50 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(category)}
            className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-sm hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
