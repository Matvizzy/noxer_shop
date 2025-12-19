import React from 'react';
import '../styles/components.css';

const Banner: React.FC = () => {
  const handleLearnMore = () => {
    alert('Переход к деталям акции');
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-text">
          <h2 className="banner-title">
            ВСЕМ КЛИЕНТАМ ДАРИМ 500 РУБ.
          </h2>
          <p className="banner-subtitle">
            на первый заказ в телеграм-боте
          </p>
        </div>
        
        <div className="banner-actions">
          <button 
            className="banner-button"
            onClick={handleLearnMore}
            aria-label="Подробнее об акции"
          >
            Подробнее
          </button>
        </div>
      </div>
      
      <div className="banner-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>
    </div>
  );
};

export default Banner;