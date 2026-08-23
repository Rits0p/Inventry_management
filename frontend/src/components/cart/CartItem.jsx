
/**
 * CartItem – a single row in the cart.
 *
 * Props:
 *   item          { id, name, price, quantity, image, stock }
 *   onQuantity    (fn) – called with (id, newQty)
 *   onRemove      (fn) – called with (id)
 */
export default function CartItem({ item, onQuantity, onRemove }) {
  return (
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm p-4 sm:p-5 flex gap-4">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border border-gray-200 dark:border-white/10 flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.name}</h3>
        <p className="text-sm text-green-600 mt-1">In Stock</p>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center border border-gray-300 dark:border-white/10 rounded-sm">
            <button
              onClick={() => onQuantity?.(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium dark:text-white">{item.quantity}</span>
            <button
              onClick={() => onQuantity?.(item.id, Math.min(item.quantity + 1, item.stock ?? 99))}
              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove?.(item.id)}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-900 dark:text-white">
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ₹{item.price.toLocaleString('en-IN')} each
        </p>
      </div>
    </div>
  );
}
