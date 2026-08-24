import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { productService } from '../../../services/productService';
import { unwrapList } from '../../../services/api';
import { getApiErrorMessage } from '../../../utils/apiErrors';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import './ProductDetail.css';

function Stars({ rating }) {
  return (
    <span className="pd-stars">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`pd-star ${s <= Math.round(rating) ? 'filled' : 'empty'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState('highlights');
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      setError('');
      try {
        const data = await productService.getProduct(id);
        if (!cancelled) {
          setProduct(data);
          setQuantity(1);
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, 'Failed to load product.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.category_name) return undefined;
    let cancelled = false;
    productService
      .getProducts({ category: product.category_name, page_size: 9 })
      .then((data) => {
        if (!cancelled) {
          setRelatedProducts(
            unwrapList(data).filter((p) => p.id !== product.id).slice(0, 8)
          );
        }
      })
      .catch(() => {
        if (!cancelled) setRelatedProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [product]);

  const soldOut = (product?.stock ?? 0) === 0;

  const handleAddToCart = () => {
    if (soldOut) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlist = () => {
    setAddedToWishlist(!addedToWishlist);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <main className="pd-page">
        <LoadingSpinner label="Loading..." />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pd-page">
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <span className="text-6xl mb-4">⚠️</span>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Could not load product</h1>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2874F0] text-white font-bold rounded-full hover:shadow-lg transition">
            ← Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pd-page">
      {/* Top Bar */}
      <header className="pd-topbar">
        <Link to="/" className="pd-topbar-link">← Back to Shop</Link>
        <Link to="/cart" className="pd-topbar-cart">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>
      </header>

      {/* Hero: Full Width Image */}
      <section className="pd-hero">
        <div className="pd-hero-bg" style={{background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}}></div>
        <div className="pd-hero-content">
          <div className="pd-hero-badge">{product.category_name}</div>
          <div className="pd-hero-icon">
            {product.image ? (
              <img src={product.image} alt={product.name} loading="lazy" style={{ maxHeight: '10rem', maxWidth: '18rem', borderRadius: '1.5rem' }} />
            ) : (
              '🛍️'
            )}
          </div>
          {product.discount > 0 && (
            <div className="pd-hero-discount">-{product.discount}% OFF</div>
          )}
        </div>
        <div className="pd-hero-thumbs">
          {[0, 1, 2].map(idx => (
            <button key={idx} onClick={() => setSelectedImage(idx)} className={`pd-hero-thumb ${selectedImage === idx ? 'active' : ''}`}></button>
          ))}
        </div>
      </section>

      {/* Product Info - Stacked Layout */}
      <section className="pd-product">
        <div className="pd-container">
          {/* Title Section */}
          <div className="pd-title-section">
            <p className="pd-brand-tag">{product.brand}</p>
            <h1 className="pd-main-title">{product.name}</h1>
            <div className="pd-rating-inline">
              <span className="pd-rating-score">{Number(product.rating ?? 0).toFixed(1)}</span>
              <Stars rating={product.rating} />
              <span className="pd-rating-text">{(product.reviews_count ?? 0).toLocaleString()} reviews</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="pd-price-block">
            <div className="pd-price-row">
              <span className="pd-price-big">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price > product.price && (
                <span className="pd-price-old">₹{product.original_price.toLocaleString('en-IN')}</span>
              )}
            </div>
            {product.original_price > product.price && (
              <div className="pd-savings-badge">
                Save ₹{(product.original_price - product.price).toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className={`pd-stock-indicator ${product.stock > 10 ? 'available' : 'low'}`}>
            <span className="pd-stock-dot"></span>
            {soldOut ? 'Out of Stock' : product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </div>

          {/* Quantity + Actions */}
          <div className="pd-purchase-row">
            <div className="pd-qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
            <button onClick={handleAddToCart} disabled={soldOut} className={`pd-add-cart ${addedToCart ? 'added' : ''}`}>
              {addedToCart ? '✓ Added' : soldOut ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="pd-buy-now" onClick={handleBuyNow} disabled={soldOut}>Buy Now</button>
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist} className={`pd-wishlist-toggle ${addedToWishlist ? 'active' : ''}`}>
            <svg fill={addedToWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {addedToWishlist ? 'Saved' : 'Save'}
          </button>

          {/* Accordion Sections */}
          <div className="pd-accordion">
            {/* Highlights */}
            <div className="pd-accordion-item">
              <button onClick={() => toggleSection('highlights')} className={`pd-accordion-trigger ${openSection === 'highlights' ? 'open' : ''}`}>
                <span>Highlights</span>
                <span className="pd-accordion-icon">{openSection === 'highlights' ? '−' : '+'}</span>
              </button>
              {openSection === 'highlights' && (
                <div className="pd-accordion-content">
                  <ul className="pd-highlight-list">
                    {(product.highlights ?? []).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pd-accordion-item">
              <button onClick={() => toggleSection('description')} className={`pd-accordion-trigger ${openSection === 'description' ? 'open' : ''}`}>
                <span>Description</span>
                <span className="pd-accordion-icon">{openSection === 'description' ? '−' : '+'}</span>
              </button>
              {openSection === 'description' && (
                <div className="pd-accordion-content">
                  <p className="pd-desc-text">{product.description}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="pd-accordion-item">
              <button onClick={() => toggleSection('specifications')} className={`pd-accordion-trigger ${openSection === 'specifications' ? 'open' : ''}`}>
                <span>Specifications</span>
                <span className="pd-accordion-icon">{openSection === 'specifications' ? '−' : '+'}</span>
              </button>
              {openSection === 'specifications' && (
                <div className="pd-accordion-content">
                  <div className="pd-spec-grid">
                    {(product.specifications ?? []).map((spec, idx) => (
                      <div key={idx} className="pd-spec-item">
                        <span className="pd-spec-label">{spec.label}</span>
                        <span className="pd-spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info - Horizontal Strip */}
          <div className="pd-delivery-strip">
            <div className="pd-delivery-item">
              <span className="pd-delivery-icon">🚚</span>
              <div>
                <p className="pd-delivery-title">Free Delivery</p>
                <p className="pd-delivery-sub">3-5 days</p>
              </div>
            </div>
            <div className="pd-delivery-item">
              <span className="pd-delivery-icon">🔄</span>
              <div>
                <p className="pd-delivery-title">7-Day Returns</p>
                <p className="pd-delivery-sub">Easy returns</p>
              </div>
            </div>
            <div className="pd-delivery-item">
              <span className="pd-delivery-icon">🛡️</span>
              <div>
                <p className="pd-delivery-title">Warranty</p>
                <p className="pd-delivery-sub">1 year</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products - Horizontal Scroll */}
      {relatedProducts.length > 0 && (
        <section className="pd-related">
          <div className="pd-container">
            <h2 className="pd-related-heading">You Might Also Like</h2>
            <div className="pd-related-scroll">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="pd-related-card">
                  <div className="pd-related-img">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '🛍️'
                    )}
                    {p.discount > 0 && <span className="pd-related-badge">-{p.discount}%</span>}
                  </div>
                  <div className="pd-related-info">
                    <p className="pd-related-brand">{p.brand}</p>
                    <h3 className="pd-related-name">{p.name}</h3>
                    <div className="pd-related-rating">
                      <Stars rating={p.rating} />
                      <span>({(p.reviews_count ?? 0).toLocaleString()})</span>
                    </div>
                    <div className="pd-related-price">
                      <span className="pd-related-current">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.original_price > p.price && (
                        <span className="pd-related-old">₹{p.original_price.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

