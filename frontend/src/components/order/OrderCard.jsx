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
    <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-[rgba(128,128,128,0.06)] border-b border-[var(--card-border)]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Order ID:</span>{' '}
            <span className="font-medium text-[#2874F0]">{order.id}</span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Ordered on:</span>{' '}
            <span className="font-medium text-[var(--text-primary)]">{order.date}</span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Total:</span>{' '}
            <span className="font-bold text-[var(--text-primary)]">
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
              className="w-16 h-16 object-cover rounded border border-[var(--card-border)] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)] line-clamp-2">{item.name}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Qty: {item.qty} • ₹{Number(item.price).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--card-border)]">
          <p className="text-sm text-[var(--text-secondary)]">
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
                className="px-4 py-2 text-sm font-medium border border-[var(--card-border)] rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition"
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
