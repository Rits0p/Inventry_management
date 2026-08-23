import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * ProductGrid – responsive grid of ProductCards.
 *
 * Props:
 *   products   (array)    – product objects
 *   onAddToCart(function) – passed to each ProductCard
 *   loading    (bool)     – show loading state
 *   emptyTitle (string)   – empty state heading
 *   emptyMsg   (string)   – empty state message
 */
export default function ProductGrid({
  products = [],
  onAddToCart,
  loading = false,
  emptyTitle = 'No products found',
  emptyMsg = 'Try changing the filters or search term',
}) {
  if (loading) return <LoadingSpinner />;

  if (products.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyTitle}
        message={emptyMsg}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
