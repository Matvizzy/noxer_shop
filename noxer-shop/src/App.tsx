import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Banner from './components/Banner'
import CategoryScroll from './components/CategoryScroll'
import ProductGrid from './components/ProductGrid'
import SearchBar from './components/SearchBar'
import SearchSuggestions from './components/SearchSuggestions'
import Filters from './components/Filters'
import LoadingSpinner from './components/LoadingSpinner'
import { useProducts } from './hooks/useProducts'
import { useInfiniteScroll } from './hooks/useInfiniteScroll'
import type { FilterParams } from './types'

const App: React.FC = () => {
  const {
    mainProducts,
    filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    loadMoreProducts,
    page,
    totalPages,
    totalItems
  } = useProducts()

  const [showFilters, setShowFilters] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchInputFocused, setSearchInputFocused] = useState(false)

  const { sentinelRef } = useInfiniteScroll({
    hasMore: page < totalPages,
    isLoading: loading,
    onLoadMore: loadMoreProducts,
    threshold: 200
  })

  const handleCategorySelect = useCallback((category: string) => {
    setSearchQuery('');
    
    setFilters({
      category: category === 'все' ? '' : category.toLowerCase()
    });
    
    window.scrollTo({ top: 600, behavior: 'smooth' });
  }, [setSearchQuery, setFilters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setShowSearchSuggestions(false)
  }, [setSearchQuery])

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSearchSuggestions(false)
  }, [setSearchQuery])

  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters)
  }, [setFilters])

  const handleSearchFocus = () => {
    setSearchInputFocused(true)
    if (searchQuery.length > 0) {
      setShowSearchSuggestions(true)
    }
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchInputFocused(false)
      setShowSearchSuggestions(false)
    }, 200)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchArea = document.querySelector('.search-container')
      if (searchArea && !searchArea.contains(event.target as Node)) {
        setShowSearchSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasSearchResults = searchQuery.trim().length > 0 || Object.keys(filters).length > 0
  const showMainProducts = !hasSearchResults && mainProducts.length > 0

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <div className="search-section">
            <SearchBar 
              onSearch={handleSearch}
              initialQuery={searchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            
            {searchInputFocused && showSearchSuggestions && (
              <SearchSuggestions
                query={searchQuery}
                onSuggestionSelect={handleSuggestionSelect}
                maxSuggestions={8}
                showPopularSearches={true}
              />
            )}
            
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
            >
              Фильтры {showFilters ? '▲' : '▼'}
            </button>
          </div>

          {showFilters && (
            <Filters 
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

          <Banner />

          <CategoryScroll onCategorySelect={handleCategorySelect} />

          {loading && page === 1 ? (
            <div className="loading-container">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Попробовать снова
              </button>
            </div>
          ) : (
            <>
              {hasSearchResults && (
                <div className="results-header">
                  <h2 className="results-title">
                    {filteredProducts.length > 0 ? (
                      `Найдено ${totalItems} товаров`
                    ) : (
                      'Товары не найдены'
                    )}
                  </h2>
                  {searchQuery && (
                    <p className="search-query">
                      По запросу: <strong>"{searchQuery}"</strong>
                    </p>
                  )}
                </div>
              )}

              <ProductGrid 
                products={hasSearchResults ? filteredProducts : mainProducts}
                columns={showMainProducts ? 2 : 1}
              />

              {page < totalPages && (
                <>
                  {loading ? (
                    <div className="loading-more">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="load-more-container">
                      <button 
                        onClick={loadMoreProducts}
                        className="load-more-btn"
                        disabled={loading}
                      >
                        Показать еще ({totalItems - filteredProducts.length})
                      </button>
                    </div>
                  )}
                  <div ref={sentinelRef} className="scroll-sentinel" />
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Noxer Shop. Тестовое задание для Frontend разработчика.</p>
          <p className="footer-info">
            Реализовано на React + TypeScript с использованием чистого CSS
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App