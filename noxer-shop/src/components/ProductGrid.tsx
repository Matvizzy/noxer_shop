import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';
import '../styles/components.css';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  columns?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  columns = 2 
}) => {
  if (products.length === 0) {
    return (
      <div className="empty-products">
        <div className="empty-icon">📦</div>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить поисковый запрос или фильтры</p>
      </div>
    );
  }

  return (
    <div 
      className="product-grid" 
      style={{ 
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--space-md)' 
      }}
    >
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;