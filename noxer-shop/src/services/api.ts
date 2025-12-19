import type { Product, FilterParams, ApiResponse } from '../types';
import { mockData } from './mockData';

const API_PREFIX = '/webapp/api'; 

export const productsApi = {
  async getMainProducts(): Promise<Product[]> {
    try {
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
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('query', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.minPrice) queryParams.append('min_price', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('max_price', params.maxPrice.toString());
      if (params.inStock) queryParams.append('in_stock', 'true');
      if (params.sortBy) queryParams.append('sort_by', params.sortBy);
      queryParams.append('per_page', (params.per_page || 8).toString());
      queryParams.append('page', (params.page || 1).toString());
      
      const url = `${API_PREFIX}/products/filter?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET', 
        headers: { 
          'Accept': 'application/json'
        }
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