import Badge from '../common/Badge';

const statusVariant = {
  Pending:    'orange',
  Processing: 'blue',
  Shipped:    'indigo',
  Delivered:  'green',
  Cancelled:  'red',
};

const paymentVariant = {
  Paid:     'green',
  Pending:  'yellow',
  Refunded: 'red',
};

/**
 * OrderTable – admin order data table.
 *
 * Props:
 *   orders        (array) – order objects
 *   onView        (fn)    – called with order when View clicked
 *   loading       (bool)
 */
export default function OrderTable({ orders = [], onView, loading = false }) {
  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm p-12 text-center text-[var(--text-secondary)] text-sm">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm p-12 text-center">
        <p className="text-5xl mb-3">📋</p>
        <p className="font-medium text-[var(--text-primary)]">No orders found</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-sm shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[rgba(128,128,128,0.06)] border-b border-[var(--card-border)] text-left">
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Order ID</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Customer</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Date</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Amount</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Payment</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)]">Status</th>
              <th className="px-5 py-3.5 font-medium text-[var(--text-secondary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--card-border)]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                <td className="px-5 py-4">
                  <button
                    onClick={() => onView?.(order)}
                    className="font-medium text-[#2874F0] hover:underline"
                  >
                    {order.id}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-[var(--text-primary)]">{order.customer}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{order.email}</div>
                </td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">
                  <div>{order.date}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{order.time}</div>
                </td>
                <td className="px-5 py-4 font-medium text-[var(--text-primary)]">
                  ₹{Number(order.amount).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={paymentVariant[order.payment] || 'gray'}>
                    {order.payment}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariant[order.status] || 'gray'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onView?.(order)}
                    className="text-[#2874F0] hover:text-blue-700 font-medium text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
