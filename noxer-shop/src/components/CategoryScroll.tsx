import React, { useState, useRef } from 'react';
import '../styles/components.css';

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
}

interface CategoryScrollProps {
  onCategorySelect?: (category: string) => void;
}

const CategoryScroll: React.FC<CategoryScrollProps> = ({ onCategorySelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('все');
  
  const categories: Category[] = [
    { id: 1, name: 'Все', image: '📦', productCount: 156 },
    { id: 2, name: 'Аксессуары', image: '🎩', productCount: 42 },
    { id: 3, name: 'Футболки', image: '👕', productCount: 28 },
    { id: 4, name: 'Толстовки', image: '🧥', productCount: 19 },
    { id: 5, name: 'Куртки', image: '🧥', productCount: 15 },
    { id: 6, name: 'Штаны', image: '👖', productCount: 23 },
    { id: 7, name: 'Сертификат', image: '🎁', productCount: 7 },
    { id: 8, name: 'Бутылки', image: '💧', productCount: 12 },
    { id: 9, name: 'Рюкзаки', image: '🎒', productCount: 9 },
    { id: 10, name: 'Обувь', image: '👟', productCount: 31 }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    console.log(`Выбрана категория: ${categoryName}`);
  };

  return (
    <div className="categories-section">
      <h3 className="section-title">Категории товаров</h3>
      
      <div className="categories-container">
        <button 
          className="scroll-button scroll-button-left"
          onClick={scrollLeft}
          aria-label="Прокрутить влево"
        >
          ‹
        </button>
        
        <div className="categories-scroll" ref={scrollContainerRef}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-card ${activeCategory === category.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name.toLowerCase())}
              aria-label={`Категория ${category.name}, ${category.productCount} товаров`}
            >
              <div className="category-icon">{category.image}</div>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.productCount}</span>
              </div>
            </button>
          ))}
        </div>
        
        <button 
          className="scroll-button scroll-button-right"
          onClick={scrollRight}
          aria-label="Прокрутить вправо"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default CategoryScroll;