import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OrderDetail.css';
import { orderService } from '../../../services/orderService';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import { formatINR, formatDate, formatDateTime } from '../../../utils/formatters';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const STEPS = [
  { key: 'Pending', label: 'Order Placed', icon: '📋' },
  { key: 'Processing', label: 'Processing', icon: '⚙️' },
  { key: 'Shipped', label: 'Shipped', icon: '🚚' },
  { key: 'Delivered', label: 'Delivered', icon: '✅' },
];

const STEP_INDEX = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await orderService.getOrder(id);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load order details.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <main className="od-page">
        <div className="od-container">
          <LoadingSpinner label="Loading order details..." />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="od-page">
        <div className="od-container">
          <div className="od-error">
            <div className="od-error-icon">⚠️</div>
            <h2>Could not load order</h2>
            <p>{error || 'Order not found.'}</p>
            <Link to="/orders" className="od-back-link">← Back to Orders</Link>
          </div>
        </div>
      </main>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const currentStep = isCancelled ? -1 : (STEP_INDEX[order.status] ?? 0);

  return (
    <main className="od-page">
      <div className="od-container">
        <button onClick={() => navigate('/orders')} className="od-back-btn">← Back to Orders</button>

        {/* Header */}
        <header className="od-header">
          <div className="od-header-left">
            <h1 className="od-title">Order {order.order_number}</h1>
            <p className="od-date">Placed on {formatDateTime(order.created_at)}</p>
          </div>
          <div className="od-header-right">
            <span className={`od-payment-badge ${(order.payment_status || '').toLowerCase()}`}>
              {order.payment_status}
            </span>
          </div>
        </header>

        {/* Tracking Timeline */}
        <section className="od-tracking">
          <h2 className="od-section-title">Order Status</h2>
          {isCancelled ? (
            <div className="od-cancelled-banner">
              <span className="od-cancelled-icon">❌</span>
              <div>
                <p className="od-cancelled-text">This order has been cancelled</p>
                {order.cancelled_at && (
                  <p className="od-cancelled-date">Cancelled on {formatDateTime(order.cancelled_at)}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="od-timeline">
              <div className="od-timeline-track">
                <div
                  className="od-timeline-fill"
                  style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step.key}
                    className={`od-timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="od-step-dot">
                      <span className="od-step-icon">{step.icon}</span>
                    </div>
                    <span className="od-step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="od-grid">
          {/* Items */}
          <section className="od-card od-items-card">
            <h2 className="od-section-title">Items Ordered</h2>
            <div className="od-items">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="od-item">
                  <div className="od-item-icon">📦</div>
                  <div className="od-item-info">
                    <p className="od-item-name">{item.product_name}</p>
                    <p className="od-item-meta">Qty: {item.quantity} × {formatINR(item.unit_price)}</p>
                  </div>
                  <p className="od-item-total">{formatINR(item.line_total)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Summary + Address */}
          <div className="od-side">
            {/* Price Summary */}
            <section className="od-card">
              <h2 className="od-section-title">Payment Summary</h2>
              <div className="od-summary-rows">
                <div className="od-summary-row">
                  <span>Subtotal</span>
                  <span>{formatINR(order.subtotal_amount)}</span>
                </div>
                <div className="od-summary-row">
                  <span>Delivery</span>
                  <span className={order.delivery_fee === '0.00' || order.delivery_fee === 0 ? 'od-free' : ''}>
                    {order.delivery_fee === '0.00' || order.delivery_fee === 0 ? 'FREE' : formatINR(order.delivery_fee)}
                  </span>
                </div>
                <div className="od-summary-total">
                  <span>Total</span>
                  <span>{formatINR(order.total_amount)}</span>
                </div>
              </div>
              <div className="od-payment-info">
                <span className="od-payment-label">Payment Method</span>
                <span className="od-payment-method">Razorpay</span>
              </div>
              {order.razorpay_payment_id && (
                <div className="od-payment-info">
                  <span className="od-payment-label">Payment ID</span>
                  <span className="od-payment-id">{order.razorpay_payment_id}</span>
                </div>
              )}
            </section>

            {/* Delivery Address */}
            {order.delivery_address && (
              <section className="od-card">
                <h2 className="od-section-title">Delivery Address</h2>
                <p className="od-address">{order.delivery_address}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
