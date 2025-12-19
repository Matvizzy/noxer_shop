import React from 'react';
import type { Product } from '../types';
import '../styles/components.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Используем высококачественные изображения с Unsplash
  const getOptimizedImage = (baseUrl: string) => {
    // Улучшаем качество изображений
    return baseUrl.replace(/w=\d+&h=\d+/, 'w=500&h=500&fit=crop&q=90');
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    // Можно добавить уведомление
    const event = new CustomEvent('showToast', {
      detail: { message: `${product.name} добавлен в корзину` }
    });
    window.dispatchEvent(event);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  // Вычисляем рейтинг для отображения звезд
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '⯨'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </>
    );
  };

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        <img 
          src={getOptimizedImage(product.image)} 
          alt={product.name}
          className="product-image"
          loading="lazy"
          width="500"
          height="500"
          onError={(e) => {
            // Fallback на placeholder если изображение не загрузилось
            e.currentTarget.src = `https://via.placeholder.com/500x500/eee/ccc?text=${encodeURIComponent(product.name.substring(0, 20))}`;
          }}
        />
        
        {product.discount && product.discount > 0 && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
        
        {!product.inStock && (
          <div className="out-of-stock-badge">
            Нет в наличии
          </div>
        )}
        
        <button 
          className="favorite-button"
          aria-label="Добавить в избранное"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          ♡
        </button>
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        
        <h3 className="product-name">{product.name}</h3>
        
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-price">
          <span className="current-price">
            {formatPrice(product.price)}
          </span>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        
        {product.rating !== undefined && (
          <div className="product-rating">
            <div className="stars" aria-label={`Рейтинг: ${product.rating} из 5`}>
              {renderStars(product.rating)}
            </div>
            <div className="rating-info">
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              {product.reviewsCount && (
                <span className="reviews-count">({product.reviewsCount})</span>
              )}
            </div>
          </div>
        )}
        
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">{tag}</span>
            ))}
          </div>
        )}
        
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={`Добавить ${product.name} в корзину`}
        >
          {product.inStock ? 'В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;