import React from 'react';
import '../styles/components.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner" aria-label="Загрузка">
      <div className="spinner"></div>
      <p className="loading-text">Загрузка товаров...</p>
    </div>
  );
};

export default LoadingSpinner;