import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Mock stats – replace with real API later
  const stats = [
    {
      title: 'Total Products',
      value: '1,248',
      change: '+12%',
      changeType: 'up',
      icon: '📦',
      color: 'bg-blue-50 text-[#2874F0]',
    },
    {
      title: 'Total Orders',
      value: '3,245',
      change: '+8.2%',
      changeType: 'up',
      icon: '🛒',
      color: 'bg-orange-50 text-[#FB641B]',
    },
    {
      title: 'Low Stock Items',
      value: '47',
      change: 'Needs attention',
      changeType: 'warning',
      icon: '⚠️',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      title: 'Revenue (This Month)',
      value: '₹8,42,500',
      change: '+18%',
      changeType: 'up',
      icon: '💰',
      color: 'bg-green-50 text-green-700',
    },
  ];

  const recentOrders = [
    { id: '#ORD-7841', customer: 'Rahul Sharma', amount: '₹4,299', status: 'Delivered', date: '15 Aug 2026' },
    { id: '#ORD-7839', customer: 'Priya Patel', amount: '₹1,899', status: 'Shipped', date: '15 Aug 2026' },
    { id: '#ORD-7835', customer: 'Amit Kumar', amount: '₹12,450', status: 'Processing', date: '14 Aug 2026' },
    { id: '#ORD-7828', customer: 'Sneha Reddy', amount: '₹699', status: 'Delivered', date: '14 Aug 2026' },
    { id: '#ORD-7821', customer: 'Vikram Singh', amount: '₹3,150', status: 'Cancelled', date: '13 Aug 2026' },
  ];

  const getStatusColor = (status) => {
    const map = {
      Delivered: 'bg-green-100 text-green-700',
      Shipped: 'bg-blue-100 text-blue-700',
      Processing: 'bg-yellow-100 text-yellow-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
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
                <p
                  className={`text-xs mt-2 font-medium ${
                    stat.changeType === 'up'
                      ? 'text-green-600'
                      : stat.changeType === 'warning'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products/add"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-[#FB641B]/10 text-[#FB641B] flex items-center justify-center group-hover:bg-[#FB641B] group-hover:text-white transition">
                +
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Product</p>
                <p className="text-xs text-gray-500">Create a new product listing</p>
              </div>
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center">
                🗂️
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Categories</p>
                <p className="text-xs text-gray-500">Add or edit categories</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                📦
              </div>
              <div>
                <p className="font-medium text-gray-900">View Orders</p>
                <p className="text-xs text-gray-500">Process pending orders</p>
              </div>
            </Link>

            <Link
              to="/admin/stock"
              className="flex items-center gap-3 p-3 rounded-sm border border-gray-200 hover:border-[#2874F0] hover:bg-blue-50 transition group"
            >
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                📉
              </div>
              <div>
                <p className="font-medium text-gray-900">Check Low Stock</p>
                <p className="text-xs text-gray-500">47 items need attention</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-[#2874F0] hover:underline">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-600">Order ID</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Customer</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Amount</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium text-[#2874F0]">{order.id}</td>
                    <td className="px-5 py-3.5 text-gray-900">{order.customer}</td>
                    <td className="px-5 py-3.5 font-medium">{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
