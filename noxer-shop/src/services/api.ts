import type { Product, FilterParams, ApiResponse } from '../types';
import { mockData } from './mockData';

// УБИРАЕМ BASE_URL - теперь запросы идут через прокси
const API_PREFIX = '/webapp/api'; // ← Важно: без домена!

export const productsApi = {
  async getMainProducts(): Promise<Product[]> {
    try {
      // Используем относительный путь
      const response = await fetch(`${API_PREFIX}/products/on_main`);
      if (!response.ok) throw new Error('Failed to fetch main products');
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for main products');
      return mockData.getMainProducts();
    }
  },

  async getFilteredProducts(
    params: FilterParams & { 
      query?: string;
      per_page?: number;
      page?: number;
    }
  ): Promise<ApiResponse<Product[]>> {
    try {
      // Используем относительный путь
      const response = await fetch(`${API_PREFIX}/products/filter`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          query: params.query || '',
          category: params.category || '',
          min_price: params.minPrice || 0,
          max_price: params.maxPrice || 100000,
          in_stock: params.inStock || false,
          sort_by: params.sortBy || 'popular',
          per_page: params.per_page || 8,
          page: params.page || 1
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Using mock data for filtered products:', error);
      const result = mockData.getFilteredProducts(params);
      return {
        data: result.products,
        total: result.total,
        page: params.page || 1,
        per_page: params.per_page || 8,
        total_pages: Math.ceil(result.total / (params.per_page || 8))
      };
    }
  },

  async getSearchSuggestions(query: string): Promise<string[]> {
    const allSuggestions = [
      'бутылки', 'футболки', 'куртки', 'сертификат',
      'женская кофта', 'детская бутылка', 'спортивные штаны',
      'сертификат на 1000 рублей', 'шапка', 'рюкзак',
      'толстовки', 'аксессуары', 'перчатки', 'кепка'
    ];
    
    return allSuggestions
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  },

  async getPopularSearches(): Promise<string[]> {
    return [
      'бутылки', 'футболки', 'куртки', 'сертификат',
      'женская кофта', 'детская бутылка', 'спортивные штаны'
    ];
  }
};