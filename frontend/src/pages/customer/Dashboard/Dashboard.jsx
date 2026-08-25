import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { dashboardService } from '../../../services/dashboardService';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import { formatINR, formatDate } from '../../../utils/formatters';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      try {
        const data = await dashboardService.getCustomerStats();
        if (!cancelled) setStatsData(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load your dashboard.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const recentOrders = statsData?.recent_orders ?? [];
  const deliveredCount = recentOrders.filter(o => o.status === 'Delivered').length;
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || 'there';

  const stats = [
    { title: 'Total Orders', value: String(statsData?.total_orders ?? 0), icon: '📦', trend: '' },
    { title: 'Pending', value: String(statsData?.pending_orders ?? 0), icon: '⏳', trend: '' },
    { title: 'Delivered', value: String(deliveredCount), icon: '✅', trend: `${recentOrders.length} recent order${recentOrders.length !== 1 ? 's' : ''}` },
    { title: 'Total Spent', value: formatINR(statsData?.total_spent ?? 0), icon: '💰', trend: '' },
  ];

  const quickLinks = [
    { title: 'Continue Shopping', desc: 'Browse latest products', icon: '🛍️', link: '/', color: 'purple' },
    { title: 'My Cart', desc: 'Review items before checkout', icon: '🛒', link: '/cart', color: 'orange' },
    { title: 'My Orders', desc: 'Track your orders', icon: '📦', link: '/orders', color: 'green' },
  ];

  return (
    <main className="dash-page">
      <div className="dash-container">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">My Dashboard</h1>
            <p className="dash-subtitle">Welcome back, {firstName}! Here's your account overview.</p>
          </div>
          <Link to="/shop" className="dash-shop-btn">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
          </Link>
        </header>

        {/* Stats Grid */}
        {loading ? (
          <LoadingSpinner label="Loading dashboard..." />
        ) : error ? (
          <div className="dash-card">
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <h3 className="dash-card-title">Could not load dashboard</h3>
            <p className="dash-link-desc">{error}</p>
          </div>
        ) : (
          <>
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
                  {recentOrders.length === 0 ? (
                    <p className="dash-link-desc">No orders yet. Start shopping to see them here!</p>
                  ) : (
                    recentOrders.map(order => {
                      const itemsCount = order.items_count ?? (order.items?.length ?? 0);
                      return (
                        <div key={order.id} className="dash-order-item">
                          <div className="dash-order-main">
                            <p className="dash-order-id">{order.order_number ?? `#${order.id}`}</p>
                            <p className="dash-order-product">{order.items?.[0]?.product_name ?? 'Order'}</p>
                            <p className="dash-order-date">{order.created_at ? formatDate(order.created_at) : ''} • {itemsCount} item{itemsCount !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="dash-order-meta">
                            <p className="dash-order-amount">{formatINR(order.total_amount)}</p>
                            <span className={`dash-order-status ${(order.status || '').toLowerCase()}`}>{order.status}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
