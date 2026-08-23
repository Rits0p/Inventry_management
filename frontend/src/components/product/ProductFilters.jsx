
/**
 * ProductFilters – category pills + sort dropdown.
 *
 * Props:
 *   categories   (string[]) – list of category names
 *   category     (string)   – active category
 *   onCategory   (fn)       – called with new category
 *   sortBy       (string)   – active sort value
 *   onSort       (fn)       – called with new sort value
 *   search       (string)   – search input value
 *   onSearch     (fn)       – called on input change
 *   showSearch   (bool)     – show search bar, default true
 */
export default function ProductFilters({
  categories = ['All'],
  category = 'All',
  onCategory,
  sortBy = 'popularity',
  onSort,
  search = '',
  onSearch,
  showSearch = true,
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm p-4 space-y-4">
      {/* Search */}
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-sm text-sm bg-white dark:bg-[#1a1a24] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2874F0] focus:border-[#2874F0]"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategory?.(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-[#2874F0] text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSort?.(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-white/10 rounded-sm text-sm bg-white dark:bg-[#1a1a24] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>
    </div>
  );
}
