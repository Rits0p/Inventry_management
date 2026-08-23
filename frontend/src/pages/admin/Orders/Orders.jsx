import { useState, useEffect } from 'react';
import './Orders.css';
import { orderService } from '../../../services/orderService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const getCustomerName = (order) => order.customer_name || order.customer || order.user_name || 'Guest';
const getCustomerEmail = (order) => order.customer_email || order.user_email || '';
const getPaymentLabel = (order) => order.payment_status || order.payment || '—';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [modalError, setModalError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page_size: 50 };
        if (statusFilter !== 'All') params.status = statusFilter;
        if (debouncedSearch) params.search = debouncedSearch;
        const data = await orderService.getOrders(params);
        if (!cancelled) setOrders(unwrapList(data));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load orders.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [statusFilter, debouncedSearch, reloadKey]);

  useEffect(() => {
    let cancelled = false;
    orderService
      .getOrders({ page_size: 100 })
      .then((data) => {
        if (!cancelled) setAllOrders(unwrapList(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const statusCounts = {
    All: allOrders.length,
    Pending: allOrders.filter(o => o.status === 'Pending').length,
    Processing: allOrders.filter(o => o.status === 'Processing').length,
    Shipped: allOrders.filter(o => o.status === 'Shipped').length,
    Delivered: allOrders.filter(o => o.status === 'Delivered').length,
    Cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'Pending');
    setModalError('');
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || updating) return;
    setUpdating(true);
    setModalError('');
    try {
      await orderService.updateStatus(selectedOrder.id, newStatus);
      setSelectedOrder(null);
      setReloadKey(key => key + 1);
    } catch (err) {
      setModalError(getApiErrorMessage(err, 'Failed to update order status.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || updating) return;
    setUpdating(true);
    setModalError('');
    try {
      await orderService.cancelOrder(selectedOrder.id);
      setSelectedOrder(null);
      setReloadKey(key => key + 1);
    } catch (err) {
      setModalError(getApiErrorMessage(err, 'Failed to cancel order.'));
    } finally {
      setUpdating(false);
    }
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
                {loading ? (
                  <tr>
                    <td colSpan="8">
                      <LoadingSpinner label="Loading orders..." />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      <span className="admin-empty-icon">⚠️</span>
                      <p>{error}</p>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      <span className="admin-empty-icon">🛒</span>
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <button onClick={() => openDetail(order)} className="order-id-btn">{order.order_number ?? order.id}</button>
                      </td>
                      <td>
                        <div className="admin-product-cell">
                          <span className="order-avatar">{getCustomerName(order).charAt(0)}</span>
                          <div>
                            <span className="admin-product-name">{getCustomerName(order)}</span>
                            <span className="order-email">{getCustomerEmail(order)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="order-date">{formatDate(order.created_at)}</div>
                        <div className="order-time">{formatTime(order.created_at)}</div>
                      </td>
                      <td>{order.items_count ?? (order.items ? order.items.length : 0)}</td>
                      <td className="admin-price">₹{Number(order.total_amount ?? 0).toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`order-payment ${String(getPaymentLabel(order)).toLowerCase()}`}>{getPaymentLabel(order)}</span>
                      </td>
                      <td>
                        <span className={`order-status ${(order.status || '').toLowerCase()}`}>{order.status || '—'}</span>
                      </td>
                      <td>
                        <button onClick={() => openDetail(order)} className="order-view-btn">View</button>
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
          <div className="admin-modal-overlay" onClick={() => { if (!updating) setSelectedOrder(null); }}>
            <div className="admin-modal order-modal" onClick={e => e.stopPropagation()}>
              <div className="order-modal-header">
                <h3 className="admin-modal-title">Order {selectedOrder.order_number ?? selectedOrder.id}</h3>
                <span className={`order-status ${(selectedOrder.status || '').toLowerCase()}`}>{selectedOrder.status || '—'}</span>
              </div>
              <div className="order-modal-body">
                <div className="order-modal-section">
                  <h4>Customer</h4>
                  <p>{getCustomerName(selectedOrder)}</p>
                  <p className="order-email">{getCustomerEmail(selectedOrder)}</p>
                </div>
                <div className="order-modal-grid">
                  <div>
                    <p className="order-modal-label">Date</p>
                    <p className="order-modal-value">{formatDate(selectedOrder.created_at)} • {formatTime(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="order-modal-label">Items</p>
                    <p className="order-modal-value">{selectedOrder.items_count ?? (selectedOrder.items ? selectedOrder.items.length : 0)} items</p>
                  </div>
                  <div>
                    <p className="order-modal-label">Payment</p>
                    <span className={`order-payment ${String(getPaymentLabel(selectedOrder)).toLowerCase()}`}>{getPaymentLabel(selectedOrder)}</span>
                  </div>
                  <div>
                    <p className="order-modal-label">Total</p>
                    <p className="order-modal-total">₹{Number(selectedOrder.total_amount ?? 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Update Status</label>
                  <select value={newStatus} onChange={e => setNewStatus(e.target.value)} disabled={updating} className="admin-select-full">
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {modalError && <p className="admin-modal-text">{modalError}</p>}
              </div>
              <div className="admin-modal-actions">
                <button onClick={() => setSelectedOrder(null)} disabled={updating} className="admin-modal-btn cancel">Close</button>
                {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Processing') && (
                  <button onClick={handleCancelOrder} disabled={updating} className="admin-modal-btn delete">Cancel Order</button>
                )}
                <button onClick={handleStatusUpdate} disabled={updating || newStatus === selectedOrder.status} className="admin-modal-btn confirm-orange">Update Status</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
