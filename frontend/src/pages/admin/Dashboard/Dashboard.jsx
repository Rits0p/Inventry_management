import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: 'Total Products', value: '1,248', change: '+12%', trend: 'up', icon: '📦' },
    { title: 'Total Orders', value: '3,245', change: '+8.2%', trend: 'up', icon: '🛒' },
    { title: 'Low Stock', value: '47', change: 'Needs attention', trend: 'warning', icon: '⚠️' },
    { title: 'Revenue', value: '₹8,42,500', change: '+18%', trend: 'up', icon: '💰' },
  ];

  const recentOrders = [
    { id: '#ORD-7841', customer: 'Rahul Sharma', amount: '₹4,299', status: 'Delivered', date: '15 Aug 2026' },
    { id: '#ORD-7839', customer: 'Priya Patel', amount: '₹1,899', status: 'Shipped', date: '15 Aug 2026' },
    { id: '#ORD-7835', customer: 'Amit Kumar', amount: '₹12,450', status: 'Processing', date: '14 Aug 2026' },
    { id: '#ORD-7828', customer: 'Sneha Reddy', amount: '₹699', status: 'Delivered', date: '14 Aug 2026' },
    { id: '#ORD-7821', customer: 'Vikram Singh', amount: '₹3,150', status: 'Cancelled', date: '13 Aug 2026' },
  ];

  const quickActions = [
    { title: 'Add Product', desc: 'Create a new listing', icon: '+', link: '/admin/products/add', color: 'orange' },
    { title: 'Manage Categories', desc: 'Add or edit categories', icon: '🗂️', link: '/admin/categories', color: 'blue' },
    { title: 'View Orders', desc: 'Process pending orders', icon: '📦', link: '/admin/orders', color: 'green' },
    { title: 'Check Low Stock', desc: '47 items need attention', icon: '📉', link: '/admin/stock', color: 'amber' },
  ];

  return (
    <main className="dash-page dark:bg-[#0e0e14]">
      <div className="dash-container">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title dark:text-white">Admin Dashboard</h1>
            <p className="dash-subtitle dark:text-gray-400">Welcome back! Here's what's happening today.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="dash-stats">
          {stats.map((stat, idx) => (
            <div key={stat.title} className="dash-stat-card dark:bg-[#1a1a24]" style={{'--delay': `${idx * 0.1}s`}}>
              <div className="dash-stat-icon">{stat.icon}</div>
              <div className="dash-stat-info">
                <p className="dash-stat-value dark:text-white">{stat.value}</p>
                <p className="dash-stat-title dark:text-gray-400">{stat.title}</p>
              </div>
              <p className={`dash-stat-change ${stat.trend}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="dash-content">
          {/* Quick Actions */}
          <div className="dash-card dash-quick-links dark:bg-[#1a1a24]">
            <h2 className="dash-card-title dark:text-white">Quick Actions</h2>
            <div className="dash-links-list">
              {quickActions.map(action => (
                <Link key={action.title} to={action.link} className={`dash-link-item ${action.color}`}>
                  <span className="dash-link-icon">{action.icon}</span>
                  <div>
                    <p className="dash-link-title dark:text-white">{action.title}</p>
                    <p className="dash-link-desc dark:text-gray-400">{action.desc}</p>
                  </div>
                  <span className="dash-link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="dash-card dash-table-card dark:bg-[#1a1a24]">
            <div className="dash-card-header">
              <h2 className="dash-card-title dark:text-white">Recent Orders</h2>
              <Link to="/admin/orders" className="dash-view-all">View All →</Link>
            </div>
            <div className="dash-table-wrapper">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="dash-table-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="dash-table-amount">{order.amount}</td>
                      <td>
                        <span className={`dash-table-status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td className="dash-table-date">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
