import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';
import { orderService } from '../../../services/orderService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import { formatINR, formatDate } from '../../../utils/formatters';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      try {
        const data = await orderService.getOrders();
        if (!cancelled) setOrders(unwrapList(data));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load your orders.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const statusCounts = {
    All: orders.length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <main className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <header className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">Track and manage your orders</p>
        </header>

        {/* Filter Tabs */}
        <div className="orders-filters">
          {['All', 'Delivered', 'Shipped', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`orders-filter-btn ${statusFilter === status ? 'active' : ''}`}
            >
              <span>{status}</span>
              <span className="orders-filter-count">{statusCounts[status]}</span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {loading ? (
            <LoadingSpinner label="Loading orders..." />
          ) : error ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">⚠️</div>
              <h3 className="orders-empty-title">Could not load orders</h3>
              <p className="orders-empty-desc">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">📦</div>
              <h3 className="orders-empty-title">No orders found</h3>
              <p className="orders-empty-desc">You haven't placed any orders yet.</p>
              <Link to="/" className="orders-empty-btn">Start Shopping</Link>
            </div>
          ) : (
            filtered.map(order => (
              <div key={order.id} className={`orders-card ${expandedOrder === order.id ? 'expanded' : ''}`}>
                {/* Order Header */}
                <div className="orders-card-header" onClick={() => toggleExpand(order.id)}>
                  <div className="orders-card-main">
                    <div className="orders-card-id">{order.order_number ?? `#${order.id}`}</div>
                    <div className="orders-card-meta">
                      <span>{order.created_at ? formatDate(order.created_at) : ''}</span>
                      <span>•</span>
                      <span>{(order.items?.length ?? order.items_count ?? 0)} item{(order.items?.length ?? order.items_count ?? 0) > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="orders-card-right">
                    <span className="orders-card-amount">{formatINR(order.total_amount)}</span>
                    <span className={`orders-status-badge ${(order.status || '').toLowerCase()}`}>{order.status}</span>
                  </div>
                  <span className="orders-expand-icon">{expandedOrder === order.id ? '−' : '+'}</span>
                </div>

                {/* Order Items (Expandable) */}
                {expandedOrder === order.id && (
                  <div className="orders-card-body">
                    <div className="orders-items">
                      {(order.items ?? []).map((item, idx) => (
                        <div key={idx} className="orders-item">
                          <div className="orders-item-icon">📦</div>
                          <div className="orders-item-details">
                            <p className="orders-item-name">{item.product_name}</p>
                            <p className="orders-item-meta">Qty: {item.quantity} • {formatINR(item.unit_price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="orders-card-footer">
                      <p className="orders-delivery-info">
                        {(order.status === 'Delivered' || order.status === 'Shipped') && <>Placed on <strong>{formatDate(order.created_at)}</strong></>}
                        {order.status === 'Cancelled' && <span className="orders-cancelled-text">Order was cancelled</span>}
                      </p>
                      <div className="orders-card-actions">
                        {order.status === 'Delivered' && (
                          <button className="orders-btn-secondary">Buy Again</button>
                        )}
                        <button className="orders-btn-primary">View Details</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
