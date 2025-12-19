import React, { useState, useEffect } from 'react';
import type { FilterParams } from '../types';
import '../styles/components.css';

interface FiltersProps {
  currentFilters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

const Filters: React.FC<FiltersProps> = ({ currentFilters, onFilterChange }) => {
  const [priceInputs, setPriceInputs] = useState({
    min: currentFilters.minPrice?.toString() || '',
    max: currentFilters.maxPrice?.toString() || '10000'
  });

  useEffect(() => {
    setPriceInputs({
      min: currentFilters.minPrice?.toString() || '',
      max: currentFilters.maxPrice?.toString() || '10000'
    });
  }, [currentFilters]);

  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'бутылки', label: 'Бутылки' },
    { value: 'футболки', label: 'Футболки' },
    { value: 'куртки', label: 'Куртки' },
    { value: 'штаны', label: 'Штаны' },
    { value: 'аксессуары', label: 'Аксессуары' },
    { value: 'сертификаты', label: 'Сертификаты' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price_asc', label: 'По возрастанию цены' },
    { value: 'price_desc', label: 'По убыванию цены' },
    { value: 'name', label: 'По названию' },
    { value: 'rating', label: 'По рейтингу' }
  ];

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const newInputs = { ...priceInputs, [field]: value };
    setPriceInputs(newInputs);

    const min = newInputs.min ? parseInt(newInputs.min) : undefined;
    const max = newInputs.max ? parseInt(newInputs.max) : undefined;
    
    if (min !== undefined && isNaN(min)) return;
    if (max !== undefined && isNaN(max)) return;
    if (min !== undefined && max !== undefined && min > max) return;

    onFilterChange({
      ...currentFilters,
      minPrice: min,
      maxPrice: max
    });
  };

  const handlePriceBlur = () => {
    const min = priceInputs.min ? Math.max(0, parseInt(priceInputs.min) || 0) : undefined;
    const max = priceInputs.max ? Math.min(100000, parseInt(priceInputs.max) || 10000) : undefined;

    setPriceInputs({
      min: min?.toString() || '',
      max: max?.toString() || '10000'
    });

    onFilterChange({
      ...currentFilters,
      minPrice: min,
      maxPrice: max
    });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...currentFilters,
      category: category || undefined
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({
      ...currentFilters,
      sortBy: sortBy as FilterParams['sortBy']
    });
  };

  const handleStockChange = (inStock: boolean) => {
    onFilterChange({
      ...currentFilters,
      inStock: inStock || undefined
    });
  };

  const resetFilters = () => {
    setPriceInputs({ min: '', max: '10000' });
    onFilterChange({});
  };

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h3>Фильтры</h3>
        <button 
          className="reset-filters"
          onClick={resetFilters}
        >
          Сбросить все
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <h4 className="filter-title">Категория</h4>
          <div className="filter-options">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`filter-option ${currentFilters.category === category.value ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Цена, ₽</h4>
          <div className="price-filter">
            <div className="price-inputs">
              <div className="price-input-group">
                <label htmlFor="min-price" className="price-label">от</label>
                <input
                  id="min-price"
                  type="number"
                  min="0"
                  max="100000"
                  step="100"
                  value={priceInputs.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  onBlur={handlePriceBlur}
                  className="price-input"
                  placeholder="0"
                  aria-label="Минимальная цена"
                />
              </div>
              
              <div className="price-input-group">
                <label htmlFor="max-price" className="price-label">до</label>
                <input
                  id="max-price"
                  type="number"
                  min="0"
                  max="100000"
                  step="100"
                  value={priceInputs.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  onBlur={handlePriceBlur}
                  className="price-input"
                  placeholder="10000"
                  aria-label="Максимальная цена"
                />
              </div>
            </div>
            
            <div className="price-range-display">
              <span className="price-range-min">{priceInputs.min || 0} ₽</span>
              <span className="price-range-separator">—</span>
              <span className="price-range-max">{priceInputs.max || 10000} ₽</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Наличие</h4>
          <div className="filter-options">
            <button
              className={`filter-option ${currentFilters.inStock === true ? 'active' : ''}`}
              onClick={() => handleStockChange(true)}
            >
              В наличии
            </button>
            <button
              className={`filter-option ${currentFilters.inStock === false ? 'active' : ''}`}
              onClick={() => handleStockChange(false)}
            >
              Под заказ
            </button>
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Сортировка</h4>
          <select
            value={currentFilters.sortBy || 'popular'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="sort-select"
            aria-label="Сортировка товаров"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="active-filters">
        {currentFilters.category && (
          <span className="active-filter">
            Категория: {categories.find(c => c.value === currentFilters.category)?.label}
            <button onClick={() => handleCategoryChange('')}>×</button>
          </span>
        )}
        {(currentFilters.minPrice || currentFilters.maxPrice) && (
          <span className="active-filter">
            Цена: {currentFilters.minPrice || 0}₽ — {currentFilters.maxPrice || 10000}₽
            <button onClick={() => {
              setPriceInputs({ min: '', max: '10000' });
              onFilterChange({ ...currentFilters, minPrice: undefined, maxPrice: undefined });
            }}>×</button>
          </span>
        )}
        {currentFilters.inStock !== undefined && (
          <span className="active-filter">
            {currentFilters.inStock ? 'В наличии' : 'Под заказ'}
            <button onClick={() => onFilterChange({ ...currentFilters, inStock: undefined })}>×</button>
          </span>
        )}
      </div>
    </div>
  );
};

export default Filters;