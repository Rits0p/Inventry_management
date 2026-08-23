import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { dashboardService } from '../../../services/dashboardService';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await dashboardService.getAdminStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load dashboard stats.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = [
    { title: 'Total Products', value: Number(stats?.total_products ?? 0).toLocaleString('en-IN'), change: '', trend: 'up', icon: '📦' },
    { title: 'Total Orders', value: Number(stats?.total_orders ?? 0).toLocaleString('en-IN'), change: '', trend: 'up', icon: '🛒' },
    { title: 'Low Stock', value: Number(stats?.low_stock_count ?? 0).toLocaleString('en-IN'), change: 'Needs attention', trend: 'warning', icon: '⚠️' },
    { title: 'Revenue', value: `₹${Number(stats?.total_revenue ?? 0).toLocaleString('en-IN')}`, change: '', trend: 'up', icon: '💰' },
  ];

  const recentOrders = stats?.recent_orders ?? [];

  const quickActions = [
    { title: 'Add Product', desc: 'Create a new listing', icon: '+', link: '/admin/products/add', color: 'orange' },
    { title: 'Manage Categories', desc: 'Add or edit categories', icon: '🗂️', link: '/admin/categories', color: 'blue' },
    { title: 'View Orders', desc: 'Process pending orders', icon: '📦', link: '/admin/orders', color: 'green' },
    { title: 'Check Low Stock', desc: `${Number(stats?.low_stock_count ?? 0)} items need attention`, icon: '📉', link: '/admin/stock', color: 'amber' },
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

        {loading ? (
          <LoadingSpinner label="Loading dashboard..." />
        ) : error ? (
          <div className="admin-empty-card">
            <span className="admin-empty-icon">⚠️</span>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="dash-stats">
              {statCards.map((stat, idx) => (
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
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="admin-empty">
                            <span className="admin-empty-icon">🛒</span>
                            <p>No recent orders yet</p>
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map(order => (
                          <tr key={order.id}>
                            <td className="dash-table-id">{order.order_number ?? `#${order.id}`}</td>
                            <td>{order.customer_name || order.customer || 'Guest'}</td>
                            <td className="dash-table-amount">₹{Number(order.total_amount ?? 0).toLocaleString('en-IN')}</td>
                            <td>
                              <span className={`dash-table-status ${(order.status || '').toLowerCase()}`}>{order.status || '—'}</span>
                            </td>
                            <td className="dash-table-date">{formatDate(order.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
