import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function CustomerDashboard() {
  const stats = [
    { title: 'Total Orders', value: '12', icon: '📦', trend: '+2 this month' },
    { title: 'Pending', value: '2', icon: '⏳', trend: '2 shipping' },
    { title: 'Delivered', value: '9', icon: '✅', trend: '95% success' },
    { title: 'Cart Items', value: '3', icon: '🛒', trend: '₹12,450 total' },
  ];

  const recentOrders = [
    { id: 'ORD-7845', date: '15 Aug 2026', amount: 4299, status: 'Delivered', items: 3, product: 'Sony WH-1000XM5' },
    { id: 'ORD-7839', date: '12 Aug 2026', amount: 1899, status: 'Shipped', items: 1, product: 'Logitech MX Master 3S' },
    { id: 'ORD-7821', date: '05 Aug 2026', amount: 3150, status: 'Delivered', items: 2, product: 'JBL Flip 6 Speaker' },
  ];

  const quickLinks = [
    { title: 'Continue Shopping', desc: 'Browse latest products', icon: '🛍️', link: '/', color: 'purple' },
    { title: 'My Cart', desc: '3 items ready to checkout', icon: '🛒', link: '/cart', color: 'orange' },
    { title: 'My Orders', desc: 'Track your orders', icon: '📦', link: '/orders', color: 'green' },
  ];

  return (
    <main className="dash-page">
      <div className="dash-container">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">My Dashboard</h1>
            <p className="dash-subtitle">Welcome back, John! Here's your account overview.</p>
          </div>
          <Link to="/shop" className="dash-shop-btn">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="dash-stats">
          {stats.map((stat, idx) => (
            <div key={stat.title} className="dash-stat-card" style={{'--delay': `${idx * 0.1}s`}}>
              <div className="dash-stat-icon">{stat.icon}</div>
              <div className="dash-stat-info">
                <p className="dash-stat-value">{stat.value}</p>
                <p className="dash-stat-title">{stat.title}</p>
              </div>
              <p className="dash-stat-trend">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="dash-content">
          {/* Quick Links */}
          <div className="dash-card dash-quick-links">
            <h2 className="dash-card-title">Quick Links</h2>
            <div className="dash-links-list">
              {quickLinks.map(link => (
                <Link key={link.title} to={link.link} className={`dash-link-item ${link.color}`}>
                  <span className="dash-link-icon">{link.icon}</span>
                  <div>
                    <p className="dash-link-title">{link.title}</p>
                    <p className="dash-link-desc">{link.desc}</p>
                  </div>
                  <span className="dash-link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="dash-card dash-orders-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Recent Orders</h2>
              <Link to="/orders" className="dash-view-all">View All →</Link>
            </div>
            <div className="dash-orders-list">
              {recentOrders.map(order => (
                <div key={order.id} className="dash-order-item">
                  <div className="dash-order-main">
                    <p className="dash-order-id">{order.id}</p>
                    <p className="dash-order-product">{order.product}</p>
                    <p className="dash-order-date">{order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                  <div className="dash-order-meta">
                    <p className="dash-order-amount">₹{order.amount.toLocaleString('en-IN')}</p>
                    <span className={`dash-order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
