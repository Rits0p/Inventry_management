import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetail.css';

const ALL_PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', brand: 'Sony', price: 20994, originalPrice: 34990, discount: 40, rating: 4.7, reviews: 2841, stock: 48, sku: 'SNY-WH1000XM5', cat: 'Audio', icon: '🎧',
    highlights: ['Industry-leading noise cancellation', 'Up to 30 hours battery life', 'Multipoint connection', 'Speak-to-Chat technology', 'Lightweight design (250g)'],
    description: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. With eight microphones, Auto NC Optimizer and specially developed driver units, they offer an unprecedented level of noise cancellation and call quality.',
    specifications: [{ label: 'Brand', value: 'Sony' }, { label: 'Model', value: 'WH-1000XM5' }, { label: 'Color', value: 'Black' }, { label: 'Connectivity', value: 'Bluetooth 5.2' }, { label: 'Battery Life', value: 'Up to 30 hours' }, { label: 'Weight', value: '250 g' }] },
  { id: 2, name: 'Apple MacBook Air M2', brand: 'Apple', price: 91920, originalPrice: 114900, discount: 20, rating: 4.9, reviews: 3241, stock: 25, sku: 'APL-MBA-M2', cat: 'Laptops', icon: '💻',
    highlights: ['Apple M2 chip', '15.3" Liquid Retina Display', '18-hour battery life', '8GB Unified Memory', 'Fanless design'],
    description: 'The remarkably thin MacBook Air with the powerful M2 chip. Built around our next-generation M2 chip, MacBook Air brings an outstanding combination of performance and portability.',
    specifications: [{ label: 'Brand', value: 'Apple' }, { label: 'Processor', value: 'Apple M2' }, { label: 'RAM', value: '8 GB' }, { label: 'Storage', value: '256 GB SSD' }, { label: 'Display', value: '15.3" Retina' }, { label: 'Weight', value: '1.24 kg' }] },
  { id: 3, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 99999, originalPrice: 129999, discount: 23, rating: 4.8, reviews: 2104, stock: 35, sku: 'SMG-S24U', cat: 'Smartphones', icon: '📱',
    highlights: ['Snapdragon 8 Gen 3', '200MP Camera', 'S Pen included', 'Titanium frame', 'Galaxy AI built-in'],
    description: 'Galaxy AI is here. Search like never before, effortlessly translate calls and texts, and get smart organization with S Pen and Note Assist.',
    specifications: [{ label: 'Brand', value: 'Samsung' }, { label: 'Processor', value: 'Snapdragon 8 Gen 3' }, { label: 'RAM', value: '12 GB' }, { label: 'Storage', value: '256 GB' }, { label: 'Display', value: '6.8" QHD+ AMOLED' }, { label: 'Battery', value: '5000 mAh' }] },
  { id: 4, name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', price: 119999, originalPrice: 149999, discount: 20, rating: 4.7, reviews: 892, stock: 15, sku: 'ASUS-ROG-G14', cat: 'Gaming', icon: '🎮',
    highlights: ['AMD Ryzen 9 7940HS', 'NVIDIA RTX 4060', '14" QHD 165Hz display', 'AniMe Matrix LED', '1TB SSD'],
    description: 'The ROG Zephyrus G14 is an ultra-slim gaming laptop powered by AMD Ryzen 9 processor and NVIDIA GeForce RTX 4060 GPU.',
    specifications: [{ label: 'Brand', value: 'ASUS' }, { label: 'Processor', value: 'AMD Ryzen 9 7940HS' }, { label: 'GPU', value: 'RTX 4060' }, { label: 'RAM', value: '16 GB' }, { label: 'Display', value: '14" QHD 165Hz' }, { label: 'Weight', value: '1.72 kg' }] },
  { id: 5, name: 'iPad Pro 12.9" M2', brand: 'Apple', price: 89900, originalPrice: 112900, discount: 20, rating: 4.8, reviews: 1567, stock: 20, sku: 'APL-IPDPRO-M2', cat: 'Tablets', icon: '📱',
    highlights: ['Apple M2 chip', '12.9" Liquid Retina XDR', 'Apple Pencil hover', 'Thunderbolt port', 'Face ID'],
    description: 'iPad Pro with M2 is an incredibly advanced tablet with the powerful M2 chip, a stunning Liquid Retina XDR display, and pro workflows.',
    specifications: [{ label: 'Brand', value: 'Apple' }, { label: 'Processor', value: 'Apple M2' }, { label: 'Storage', value: '256 GB' }, { label: 'Display', value: '12.9" XDR' }, { label: 'Camera', value: '12MP Wide + Ultra Wide' }, { label: 'Weight', value: '682 g' }] },
  { id: 6, name: 'Dell XPS 15 OLED', brand: 'Dell', price: 151999, originalPrice: 189999, discount: 20, rating: 4.7, reviews: 724, stock: 12, sku: 'DLL-XPS15', cat: 'Laptops', icon: '💻',
    highlights: ['13th Gen Intel Core i7', '15.6" 3.5K OLED', 'NVIDIA RTX 4050', '16GB DDR5', 'Fingerprint reader'],
    description: 'The Dell XPS 15 features a stunning 3.5K OLED display and powerful Intel 13th Gen processors for creative professionals.',
    specifications: [{ label: 'Brand', value: 'Dell' }, { label: 'Processor', value: 'Intel Core i7-13700H' }, { label: 'RAM', value: '16 GB DDR5' }, { label: 'Storage', value: '512 GB SSD' }, { label: 'Display', value: '15.6" 3.5K OLED' }, { label: 'Weight', value: '1.86 kg' }] },
];

const RELATED_PRODUCTS = [
  { id: 9, name: 'Keychron Q1 Pro Keyboard', brand: 'Keychron', price: 13599, originalPrice: 16999, discount: 20, rating: 4.8, reviews: 643, icon: '🖱️' },
  { id: 10, name: 'LG 27" 4K IPS Monitor', brand: 'LG', price: 25794, originalPrice: 42990, discount: 40, rating: 4.7, reviews: 1203, icon: '🖥️' },
  { id: 11, name: 'Logitech MX Master 3S', brand: 'Logitech', price: 5397, originalPrice: 8995, discount: 40, rating: 4.8, reviews: 932, icon: '🖱️' },
  { id: 12, name: 'JBL Flip 6 Speaker', brand: 'JBL', price: 7199, originalPrice: 11999, discount: 40, rating: 4.6, reviews: 1540, icon: '🎧' },
];

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
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState('highlights');
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = ALL_PRODUCTS.find(p => p.id === Number(id)) || ALL_PRODUCTS[0];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    setAddedToWishlist(!addedToWishlist);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
          <div className="pd-hero-badge">{product.cat}</div>
          <div className="pd-hero-icon">{product.icon}</div>
          <div className="pd-hero-discount">-{product.discount}% OFF</div>
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
              <span className="pd-rating-score">{product.rating}</span>
              <Stars rating={product.rating} />
              <span className="pd-rating-text">{product.reviews.toLocaleString()} reviews</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="pd-price-block">
            <div className="pd-price-row">
              <span className="pd-price-big">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="pd-price-old">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="pd-savings-badge">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Stock */}
          <div className={`pd-stock-indicator ${product.stock > 10 ? 'available' : 'low'}`}>
            <span className="pd-stock-dot"></span>
            {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
          </div>

          {/* Quantity + Actions */}
          <div className="pd-purchase-row">
            <div className="pd-qty-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
            </div>
            <button onClick={handleAddToCart} className={`pd-add-cart ${addedToCart ? 'added' : ''}`}>
              {addedToCart ? '✓ Added' : 'Add to Cart'}
            </button>
            <button className="pd-buy-now">Buy Now</button>
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
                    {product.highlights.map((item, idx) => (
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
                    {product.specifications.map((spec, idx) => (
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
      <section className="pd-related">
        <div className="pd-container">
          <h2 className="pd-related-heading">You Might Also Like</h2>
          <div className="pd-related-scroll">
            {RELATED_PRODUCTS.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="pd-related-card">
                <div className="pd-related-img">
                  {p.icon}
                  {p.discount > 0 && <span className="pd-related-badge">-{p.discount}%</span>}
                </div>
                <div className="pd-related-info">
                  <p className="pd-related-brand">{p.brand}</p>
                  <h3 className="pd-related-name">{p.name}</h3>
                  <div className="pd-related-rating">
                    <Stars rating={p.rating} />
                    <span>({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="pd-related-price">
                    <span className="pd-related-current">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="pd-related-old">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
