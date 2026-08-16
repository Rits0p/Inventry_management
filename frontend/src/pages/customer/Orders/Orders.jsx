import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialOrders = [
  {
    id: 'ORD-7845',
    date: '15 Aug 2026',
    amount: 4299,
    status: 'Delivered',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', qty: 1, price: 29990, image: 'https://via.placeholder.com/60' },
    ],
    deliveryDate: '18 Aug 2026',
  },
  {
    id: 'ORD-7839',
    date: '12 Aug 2026',
    amount: 1899,
    status: 'Shipped',
    items: [
      { name: 'Logitech MX Master 3S', qty: 1, price: 8995, image: 'https://via.placeholder.com/60' },
    ],
    deliveryDate: 'Expected by 17 Aug 2026',
  },
  {
    id: 'ORD-7821',
    date: '05 Aug 2026',
    amount: 3150,
    status: 'Delivered',
    items: [
      { name: 'Stainless Steel Water Bottle', qty: 2, price: 599, image: 'https://via.placeholder.com/60' },
      { name: 'Cotton T-Shirt Pack', qty: 1, price: 899, image: 'https://via.placeholder.com/60' },
    ],
    deliveryDate: '09 Aug 2026',
  },
  {
    id: 'ORD-7810',
    date: '28 Jul 2026',
    amount: 7495,
    status: 'Cancelled',
    items: [
      { name: 'Nike Air Force 1 Low', qty: 1, price: 7495, image: 'https://via.placeholder.com/60' },
    ],
    deliveryDate: null,
  },
];

export default function CustomerOrders() {
  const [orders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: 'bg-green-100 text-green-700',
      Shipped: 'bg-blue-100 text-blue-700',
      Processing: 'bg-yellow-100 text-yellow-700',
      Pending: 'bg-orange-100 text-orange-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-[#2874F0] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-12 text-center">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-1">You haven’t placed any orders yet.</p>
            <Link
              to="/"
              className="inline-block mt-5 px-6 py-2.5 bg-[#FB641B] hover:bg-[#e55a15] text-white font-medium rounded-sm transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>{' '}
                    <span className="font-medium text-[#2874F0]">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ordered on:</span>{' '}
                    <span className="font-medium text-gray-900">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>{' '}
                    <span className="font-bold text-gray-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div className="p-5 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.qty} • ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {order.status === 'Delivered' && (
                      <>Delivered on <span className="font-medium">{order.deliveryDate}</span></>
                    )}
                    {order.status === 'Shipped' && (
                      <>{order.deliveryDate}</>
                    )}
                    {order.status === 'Cancelled' && (
                      <span className="text-red-600">Order was cancelled</span>
                    )}
                  </p>

                  <div className="flex gap-3">
                    {order.status === 'Delivered' && (
                      <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-sm hover:bg-gray-50 transition">
                        Buy Again
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm font-medium text-[#2874F0] border border-[#2874F0] rounded-sm hover:bg-blue-50 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
