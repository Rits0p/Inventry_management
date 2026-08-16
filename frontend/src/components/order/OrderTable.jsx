import React from 'react';
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
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-12 text-center text-gray-500 text-sm">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-12 text-center">
        <p className="text-5xl mb-3">📋</p>
        <p className="font-medium text-gray-900">No orders found</p>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="px-5 py-3.5 font-medium text-gray-600">Order ID</th>
              <th className="px-5 py-3.5 font-medium text-gray-600">Customer</th>
              <th className="px-5 py-3.5 font-medium text-gray-600">Date</th>
              <th className="px-5 py-3.5 font-medium text-gray-600">Amount</th>
              <th className="px-5 py-3.5 font-medium text-gray-600">Payment</th>
              <th className="px-5 py-3.5 font-medium text-gray-600">Status</th>
              <th className="px-5 py-3.5 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-4">
                  <button
                    onClick={() => onView?.(order)}
                    className="font-medium text-[#2874F0] hover:underline"
                  >
                    {order.id}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-900">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="px-5 py-4 text-gray-600">
                  <div>{order.date}</div>
                  <div className="text-xs text-gray-400">{order.time}</div>
                </td>
                <td className="px-5 py-4 font-medium text-gray-900">
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
