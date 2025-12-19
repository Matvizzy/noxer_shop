import React, { useState, useEffect, useRef } from 'react';
import { productsApi } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import '../styles/components.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    productsApi.getPopularSearches().then(setPopularSearches);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      productsApi.getSearchSuggestions(debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handlePopularSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск 5000+ товаров"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
          aria-label="Поиск товаров"
        />
        <button 
          onClick={() => handleSearch()}
          className="search-button"
          aria-label="Найти"
          disabled={!query.trim()}
        >
          <span className="search-icon">🔍</span>
          <span className="search-text">Найти</span>
        </button>
      </div>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4 className="suggestions-title">Подходящие товары</h4>
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
                    tabIndex={0}
                  >
                    <span className="suggestion-icon">🔍</span>
                    <span className="suggestion-text">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="popular-searches-section">
            <h4 className="popular-title">Часто ищут:</h4>
            <div className="popular-tags">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="popular-tag"
                  onClick={() => handlePopularSearchClick(search)}
                  aria-label={`Искать ${search}`}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;