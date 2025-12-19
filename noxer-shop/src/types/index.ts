export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  description?: string;
  tags: string[];
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'popular';
  rating?: number;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}