import React, { useState } from 'react';
import './Orders.css';

const initialOrders = [
  { id: 'ORD-7845', customer: 'Rahul Sharma', email: 'rahul.sharma@email.com', amount: 4299, items: 3, status: 'Delivered', payment: 'Paid', date: '15 Aug 2026', time: '10:24 AM' },
  { id: 'ORD-7842', customer: 'Priya Patel', email: 'priya.patel@email.com', amount: 1899, items: 1, status: 'Shipped', payment: 'Paid', date: '15 Aug 2026', time: '09:12 AM' },
  { id: 'ORD-7839', customer: 'Amit Kumar', email: 'amit.k@email.com', amount: 12450, items: 5, status: 'Processing', payment: 'Paid', date: '14 Aug 2026', time: '06:45 PM' },
  { id: 'ORD-7835', customer: 'Sneha Reddy', email: 'sneha.r@email.com', amount: 699, items: 2, status: 'Delivered', payment: 'Paid', date: '14 Aug 2026', time: '02:30 PM' },
  { id: 'ORD-7831', customer: 'Vikram Singh', email: 'vikram.s@email.com', amount: 3150, items: 2, status: 'Cancelled', payment: 'Refunded', date: '13 Aug 2026', time: '11:18 AM' },
  { id: 'ORD-7828', customer: 'Ananya Gupta', email: 'ananya.g@email.com', amount: 8999, items: 1, status: 'Pending', payment: 'Pending', date: '13 Aug 2026', time: '08:55 AM' },
  { id: 'ORD-7824', customer: 'Rohit Verma', email: 'rohit.v@email.com', amount: 2450, items: 4, status: 'Shipped', payment: 'Paid', date: '12 Aug 2026', time: '04:20 PM' },
];

export default function Orders() {
  const [orders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter(order => {
    const matchSearch = order.id.toLowerCase().includes(search.toLowerCase()) || order.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Processing: orders.filter(o => o.status === 'Processing').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <main className="admin-page dark:bg-[#0e0e14]">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title dark:text-white">Orders</h1>
            <p className="admin-subtitle dark:text-gray-400">Manage and track all customer orders</p>
          </div>
        </header>

        {/* Status Tabs */}
        <div className="orders-tabs">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`orders-tab ${statusFilter === status ? 'active' : ''}`}>
              {status} <span className="orders-tab-count">{count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="admin-filters-card dark:bg-[#1a1a24]">
          <div className="admin-filters-row">
            <div className="admin-search-box">
              <span className="admin-search-icon">🔍</span>
              <input type="text" placeholder="Search by Order ID, customer name..." value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-card dark:bg-[#1a1a24]">
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      <span className="admin-empty-icon">🛒</span>
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => (
                    <tr key={order.id}>
                      <td>
                        <button onClick={() => setSelectedOrder(order)} className="order-id-btn">{order.id}</button>
                      </td>
                      <td>
                        <div className="admin-product-cell">
                          <span className="order-avatar">{order.customer.charAt(0)}</span>
                          <div>
                            <span className="admin-product-name">{order.customer}</span>
                            <span className="order-email">{order.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="order-date">{order.date}</div>
                        <div className="order-time">{order.time}</div>
                      </td>
                      <td>{order.items}</td>
                      <td className="admin-price">₹{order.amount.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`order-payment ${order.payment.toLowerCase()}`}>{order.payment}</span>
                      </td>
                      <td>
                        <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>
                        <button onClick={() => setSelectedOrder(order)} className="order-view-btn">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="admin-modal order-modal" onClick={e => e.stopPropagation()}>
              <div className="order-modal-header">
                <h3 className="admin-modal-title">Order {selectedOrder.id}</h3>
                <span className={`order-status ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
              </div>
              <div className="order-modal-body">
                <div className="order-modal-section">
                  <h4>Customer</h4>
                  <p>{selectedOrder.customer}</p>
                  <p className="order-email">{selectedOrder.email}</p>
                </div>
                <div className="order-modal-grid">
                  <div>
                    <p className="order-modal-label">Date</p>
                    <p className="order-modal-value">{selectedOrder.date} • {selectedOrder.time}</p>
                  </div>
                  <div>
                    <p className="order-modal-label">Items</p>
                    <p className="order-modal-value">{selectedOrder.items} items</p>
                  </div>
                  <div>
                    <p className="order-modal-label">Payment</p>
                    <span className={`order-payment ${selectedOrder.payment.toLowerCase()}`}>{selectedOrder.payment}</span>
                  </div>
                  <div>
                    <p className="order-modal-label">Total</p>
                    <p className="order-modal-total">₹{selectedOrder.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Update Status</label>
                  <select defaultValue={selectedOrder.status} className="admin-select-full">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-actions">
                <button onClick={() => setSelectedOrder(null)} className="admin-modal-btn cancel">Close</button>
                <button onClick={() => { alert('Status updated (demo)'); setSelectedOrder(null); }} className="admin-modal-btn confirm-orange">Update Status</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
