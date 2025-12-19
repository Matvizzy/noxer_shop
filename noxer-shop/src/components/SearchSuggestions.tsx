import React, { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/components.css';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: string) => void;
  maxSuggestions?: number;
  showPopularSearches?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionSelect,
  maxSuggestions = 8,
  showPopularSearches = true
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (showPopularSearches) {
      productsApi.getPopularSearches().then(setPopularSearches);
    }
  }, [showPopularSearches]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          const newSuggestions = await productsApi.getSearchSuggestions(debouncedQuery);
          setSuggestions(newSuggestions.slice(0, maxSuggestions));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error loading suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(debouncedQuery.length > 0);
      }
    };

    loadSuggestions();
  }, [debouncedQuery, maxSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  };

  const handlePopularSearchClick = (search: string) => {
    onSuggestionSelect(search);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    onSuggestionSelect('');
    setShowSuggestions(false);
  };

  if (!showSuggestions && query.length === 0 && !showPopularSearches) {
    return null;
  }

  return (
    <div className="search-suggestions">
      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <div className="suggestions-header">
            <h4 className="suggestions-title">Подходящие товары</h4>
            {isLoading && (
              <div className="loading-indicator">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            )}
          </div>
          
          <ul className="suggestions-list" role="listbox" aria-label="Подсказки поиска">
            {suggestions.map((suggestion, index) => (
              <li
                key={`suggestion-${index}`}
                className="suggestion-item"
                role="option"
                aria-selected={false}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSuggestionClick(suggestion);
                  }
                }}
                tabIndex={0}
              >
                <span className="suggestion-icon" aria-hidden="true">
                  🔍
                </span>
                <span className="suggestion-text">{suggestion}</span>
                <span className="suggestion-enter" aria-hidden="true">
                  ↵
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showPopularSearches && popularSearches.length > 0 && (
        <div className="popular-searches-section">
          <div className="popular-header">
            <h4 className="popular-title">Часто ищут:</h4>
            <button
              className="clear-search-button"
              onClick={handleClearSearch}
              aria-label="Очистить поиск"
            >
              Очистить
            </button>
          </div>
          
          <div className="popular-tags" role="list" aria-label="Популярные поиски">
            {popularSearches.map((search, index) => (
              <button
                key={`popular-${index}`}
                className="popular-tag"
                onClick={() => handlePopularSearchClick(search)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePopularSearchClick(search);
                  }
                }}
                aria-label={`Искать "${search}"`}
                tabIndex={0}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p className="no-results-text">Ничего не найдено по запросу "{query}"</p>
          <p className="no-results-hint">Попробуйте изменить формулировку</p>
        </div>
      )}

      <div className="search-history">
        <div className="history-header">
          <h4 className="history-title">История поиска</h4>
          <button className="clear-history" aria-label="Очистить историю">
            Очистить
          </button>
        </div>
        <div className="history-items">
          <div className="history-empty">
            История поиска пуста
          </div>
        </div>
      </div>

      <div className="keyboard-hints">
        <div className="hint-item">
          <kbd className="keyboard-key">↑</kbd>
          <kbd className="keyboard-key">↓</kbd>
          <span className="hint-text">Навигация</span>
        </div>
        <div className="hint-item">
          <kbd className="keyboard-key">Enter</kbd>
          <span className="hint-text">Выбрать</span>
        </div>
        <div className="hint-item">
          <kbd className="keyboard-key">Esc</kbd>
          <span className="hint-text">Закрыть</span>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;