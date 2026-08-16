import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  // Mock data – replace with real API later
  const stats = [
    {
      title: 'Total Orders',
      value: '12',
      icon: '📦',
      color: 'bg-blue-50 text-[#2874F0]',
    },
    {
      title: 'Pending Orders',
      value: '2',
      icon: '⏳',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Delivered',
      value: '9',
      icon: '✅',
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Cart Items',
      value: '3',
      icon: '🛒',
      color: 'bg-orange-50 text-[#FB641B]',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-7845',
      date: '15 Aug 2026',
      amount: 4299,
      status: 'Delivered',
      items: 3,
    },
    {
      id: 'ORD-7839',
      date: '12 Aug 2026',
      amount: 1899,
      status: 'Shipped',
      items: 1,
    },
    {
      id: 'ORD-7821',
      date: '05 Aug 2026',
      amount: 3150,
      status: 'Delivered',
      items: 2,
    },
  ];

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
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, John! Here’s an overview of your account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center text-lg">
                🛍️
              </div>
              <div>
                <p className="font-medium text-gray-900">Continue Shopping</p>
                <p className="text-xs text-gray-500">Browse latest products</p>
              </div>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#FB641B] flex items-center justify-center text-lg">
                🛒
              </div>
              <div>
                <p className="font-medium text-gray-900">My Cart</p>
                <p className="text-xs text-gray-500">3 items ready to checkout</p>
              </div>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                📦
              </div>
              <div>
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-xs text-gray-500">Track your orders</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-medium text-[#2874F0] hover:underline">
              View all
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-[#2874F0]">{order.id}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {order.date} • {order.items} item{order.items > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
