import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data – replace with real API later
const initialOrders = [
  {
    id: 'ORD-7845',
    customer: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    amount: 4299,
    items: 3,
    status: 'Delivered',
    payment: 'Paid',
    date: '15 Aug 2026',
    time: '10:24 AM',
  },
  {
    id: 'ORD-7842',
    customer: 'Priya Patel',
    email: 'priya.patel@email.com',
    amount: 1899,
    items: 1,
    status: 'Shipped',
    payment: 'Paid',
    date: '15 Aug 2026',
    time: '09:12 AM',
  },
  {
    id: 'ORD-7839',
    customer: 'Amit Kumar',
    email: 'amit.k@email.com',
    amount: 12450,
    items: 5,
    status: 'Processing',
    payment: 'Paid',
    date: '14 Aug 2026',
    time: '06:45 PM',
  },
  {
    id: 'ORD-7835',
    customer: 'Sneha Reddy',
    email: 'sneha.r@email.com',
    amount: 699,
    items: 2,
    status: 'Delivered',
    payment: 'Paid',
    date: '14 Aug 2026',
    time: '02:30 PM',
  },
  {
    id: 'ORD-7831',
    customer: 'Vikram Singh',
    email: 'vikram.s@email.com',
    amount: 3150,
    items: 2,
    status: 'Cancelled',
    payment: 'Refunded',
    date: '13 Aug 2026',
    time: '11:18 AM',
  },
  {
    id: 'ORD-7828',
    customer: 'Ananya Gupta',
    email: 'ananya.g@email.com',
    amount: 8999,
    items: 1,
    status: 'Pending',
    payment: 'Pending',
    date: '13 Aug 2026',
    time: '08:55 AM',
  },
  {
    id: 'ORD-7824',
    customer: 'Rohit Verma',
    email: 'rohit.v@email.com',
    amount: 2450,
    items: 4,
    status: 'Shipped',
    payment: 'Paid',
    date: '12 Aug 2026',
    time: '04:20 PM',
  },
];

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtering
  const filtered = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-indigo-100 text-indigo-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const getPaymentBadge = (payment) => {
    const styles = {
      Paid: 'text-green-600',
      Pending: 'text-yellow-600',
      Refunded: 'text-red-600',
    };
    return <span className={`font-medium ${styles[payment] || 'text-gray-600'}`}>{payment}</span>;
  };

  // Quick status counts
  const statusCounts = {
    All: orders.length,
    Pending: orders.filter((o) => o.status === 'Pending').length,
    Processing: orders.filter((o) => o.status === 'Processing').length,
    Shipped: orders.filter((o) => o.status === 'Shipped').length,
    Delivered: orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: orders.filter((o) => o.status === 'Cancelled').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-[#2874F0] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status} <span className="ml-1 opacity-80">({count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
        <div className="relative max-w-lg">
          <input
            type="text"
            placeholder="Search by Order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0] focus:border-[#2874F0]"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-5 py-3.5 font-medium text-gray-600">Order ID</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Customer</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Date</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Items</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Amount</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Payment</th>
                <th className="px-5 py-3.5 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3.5 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="font-medium">No orders found</p>
                      <p className="text-sm">Try changing the filters or search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
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
                    <td className="px-5 py-4 text-gray-700">{order.items}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">{getPaymentBadge(order.payment)}</td>
                    <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#2874F0] hover:text-blue-700 font-medium text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filtered.length}</span> of{' '}
              <span className="font-medium">{orders.length}</span> orders
            </p>
            <div className="flex gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-400 cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Order {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-sm p-4 space-y-2">
                <h4 className="font-medium text-gray-900">Customer</h4>
                <p className="text-sm text-gray-700">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.date} • {selectedOrder.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-medium text-gray-900">{selectedOrder.items} items</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-medium">{getPaymentBadge(selectedOrder.payment)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg text-gray-900">
                    ₹{selectedOrder.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Update Status (example) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Update Status
                </label>
                <select
                  defaultValue={selectedOrder.status}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874F0] bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-sm text-sm font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // TODO: call update status API
                    alert('Status updated (demo)');
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-[#FB641B] hover:bg-[#e55a15] text-white rounded-sm text-sm font-medium transition"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
