import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

const initialOrders = [
  {
    id: 'ORD-7845',
    date: '15 Aug 2026',
    amount: 4299,
    status: 'Delivered',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', qty: 1, price: 29990, icon: '🎧' },
    ],
    deliveryDate: '18 Aug 2026',
  },
  {
    id: 'ORD-7839',
    date: '12 Aug 2026',
    amount: 1899,
    status: 'Shipped',
    items: [
      { name: 'Logitech MX Master 3S', qty: 1, price: 8995, icon: '🖱️' },
    ],
    deliveryDate: 'Expected by 17 Aug 2026',
  },
  {
    id: 'ORD-7821',
    date: '05 Aug 2026',
    amount: 3150,
    status: 'Delivered',
    items: [
      { name: 'Stainless Steel Water Bottle', qty: 2, price: 599, icon: '🧴' },
      { name: 'Cotton T-Shirt Pack', qty: 1, price: 899, icon: '👕' },
    ],
    deliveryDate: '09 Aug 2026',
  },
  {
    id: 'ORD-7810',
    date: '28 Jul 2026',
    amount: 7495,
    status: 'Cancelled',
    items: [
      { name: 'Nike Air Force 1 Low', qty: 1, price: 7495, icon: '👟' },
    ],
    deliveryDate: null,
  },
];

export default function CustomerOrders() {
  const [orders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

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
          {filtered.length === 0 ? (
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
                    <div className="orders-card-id">{order.id}</div>
                    <div className="orders-card-meta">
                      <span>{order.date}</span>
                      <span>•</span>
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="orders-card-right">
                    <span className="orders-card-amount">₹{order.amount.toLocaleString('en-IN')}</span>
                    <span className={`orders-status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <span className="orders-expand-icon">{expandedOrder === order.id ? '−' : '+'}</span>
                </div>

                {/* Order Items (Expandable) */}
                {expandedOrder === order.id && (
                  <div className="orders-card-body">
                    <div className="orders-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="orders-item">
                          <div className="orders-item-icon">{item.icon}</div>
                          <div className="orders-item-details">
                            <p className="orders-item-name">{item.name}</p>
                            <p className="orders-item-meta">Qty: {item.qty} • ₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="orders-card-footer">
                      <p className="orders-delivery-info">
                        {order.status === 'Delivered' && <>Delivered on <strong>{order.deliveryDate}</strong></>}
                        {order.status === 'Shipped' && <>{order.deliveryDate}</>}
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
