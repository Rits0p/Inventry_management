import Badge from '../common/Badge';

// Map order status → Badge variant
const statusVariant = {
  Pending:    'orange',
  Processing: 'blue',
  Shipped:    'indigo',
  Delivered:  'green',
  Cancelled:  'red',
};

/**
 * OrderCard – card for the customer My Orders list.
 *
 * Props:
 *   order       { id, date, amount, status, items: [], deliveryDate }
 *   onViewDetail(fn) – called with the order when "View Details" is clicked
 *   onBuyAgain  (fn) – called with the order (only shown for Delivered)
 */
export default function OrderCard({ order, onViewDetail, onBuyAgain }) {
  return (
    <div className="bg-white dark:bg-[#1a1a24] border border-gray-200 dark:border-white/10 rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Order ID:</span>{' '}
            <span className="font-medium text-[#2874F0]">{order.id}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Ordered on:</span>{' '}
            <span className="font-medium text-gray-900 dark:text-white">{order.date}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Total:</span>{' '}
            <span className="font-bold text-gray-900 dark:text-white">
              ₹{Number(order.amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <Badge variant={statusVariant[order.status] || 'gray'}>{order.status}</Badge>
      </div>

      {/* Items */}
      <div className="p-5 space-y-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-white/10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Qty: {item.qty} • ₹{Number(item.price).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order.status === 'Delivered' && (
              <>Delivered on <span className="font-medium">{order.deliveryDate}</span></>
            )}
            {order.status === 'Shipped' && <>{order.deliveryDate}</>}
            {order.status === 'Cancelled' && (
              <span className="text-red-600">Order was cancelled</span>
            )}
          </p>

          <div className="flex gap-3">
            {order.status === 'Delivered' && (
              <button
                onClick={() => onBuyAgain?.(order)}
                className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-white/10 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition"
              >
                Buy Again
              </button>
            )}
            <button
              onClick={() => onViewDetail?.(order)}
              className="px-4 py-2 text-sm font-medium text-[#2874F0] border border-[#2874F0] rounded-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
