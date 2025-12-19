import { useState, useEffect, useCallback, useRef } from 'react';
import { productsApi } from '../services/api';
import type { Product, FilterParams } from '../types';

export function useProducts() {
  const [mainProducts, setMainProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterParams>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const prevSearchQueryRef = useRef('');
  const prevFiltersRef = useRef<FilterParams>({});

  const loadMainProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await productsApi.getMainProducts();
      setMainProducts(products);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить товары. Пожалуйста, проверьте соединение.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (
    query: string,
    filterParams: FilterParams,
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      const response = await productsApi.getFilteredProducts({
        query,
        ...filterParams,
        per_page: 8,
        page: pageNum
      });
      
      setFilteredProducts(prev => 
        pageNum === 1 || !append ? response.data : [...prev, ...response.data]
      );
      setTotalPages(response.total_pages);
      setTotalItems(response.total);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError('Ошибка при поиске товаров');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreProducts = useCallback(async () => {
    if (page >= totalPages || loading) return;
    
    const nextPage = page + 1;
    await searchProducts(searchQuery, filters, nextPage, true);
  }, [page, totalPages, loading, searchQuery, filters, searchProducts]);

  const updateFilters = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    loadMainProducts();
  }, [loadMainProducts]);

  useEffect(() => {
    const queryChanged = searchQuery !== prevSearchQueryRef.current;
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
    
    if (!queryChanged && !filtersChanged) return;
    
    prevSearchQueryRef.current = searchQuery;
    prevFiltersRef.current = { ...filters };
    
    if (searchQuery.trim() || Object.keys(filters).length > 0) {
      searchProducts(searchQuery, filters, 1, false);
    } else {
      setFilteredProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  }, [searchQuery, filters, searchProducts]);

  return {
    mainProducts,
    filteredProducts,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters: updateFilters,
    page,
    totalPages,
    totalItems,
    
    loadMainProducts,
    searchProducts,
    loadMoreProducts,
    refresh: () => {
      if (searchQuery.trim() || Object.keys(filters).length > 0) {
        searchProducts(searchQuery, filters, 1, false);
      } else {
        loadMainProducts();
      }
    }
  };
}