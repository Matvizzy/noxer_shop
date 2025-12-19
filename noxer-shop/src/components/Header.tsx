import React from 'react';
import '../styles/components.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1>Noxer Shop</h1>
            <p className="logo-subtitle">Интернет магазин</p>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">Мой аккаунт</span>
            </div>
            
            <button className="cart-button" aria-label="Корзина">
              <span className="cart-icon">🛒</span>
              <span className="cart-count">3</span>
            </button>
            
            <button className="menu-toggle" aria-label="Меню">
              <span className="menu-icon">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;