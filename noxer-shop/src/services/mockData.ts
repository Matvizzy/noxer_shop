import type { Product } from '../types';

export const mockData = {
  getMainProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'Бутылка',
        price: 2800,
        originalPrice: 3500,
        discount: 20,
        category: 'бутылки',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop',
        description: 'бутылка',
        tags: ['спорт', 'фитнес', 'вода'],
        inStock: true,
        rating: 4.5,
        reviewsCount: 128
      },
      {
        id: 2,
        name: 'Весенняя куртка',
        price: 1505,
        originalPrice: 2700,
        category: 'куртки',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
        description: 'Легкая ветровка для весенней погоды',
        tags: ['весна', 'одежда', 'верхняя одежда'],
        inStock: true,
        rating: 4.2,
        reviewsCount: 89
      },
      {
        id: 3,
        name: 'Сертификат на покупки',
        price: 500,
        category: 'сертификаты',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop',
        description: 'Подарочный сертификат на любые товары',
        tags: ['подарок', 'сертификат'],
        inStock: true,
        rating: 4.8,
        reviewsCount: 256
      },
      {
        id: 4,
        name: 'Спортивные штаны',
        price: 1550,
        category: 'штаны',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
        description: 'Удобные штаны для тренировок',
        tags: ['спорт', 'тренировка', 'комфорт'],
        inStock: false,
        rating: 4.0,
        reviewsCount: 67
      },
      {
        id: 5,
        name: 'Футболка с принтом',
        price: 890,
        originalPrice: 1200,
        discount: 25,
        category: 'футболки',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        tags: ['повседневная', 'принт'],
        inStock: true,
        rating: 4.3,
        reviewsCount: 142
      },
      {
        id: 6,
        name: 'Рюкзак городской',
        price: 2300,
        category: 'аксессуары',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        tags: ['город', 'учеба', 'работа'],
        inStock: true,
        rating: 4.6,
        reviewsCount: 203
      }
    ];
  },

  getFilteredProducts(params: any) {
    let products = [...this.getMainProducts()];
    
    // Фильтрация по поисковому запросу
    if (params.query) {
      const query = params.query.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query)) ||
        p.description?.toLowerCase().includes(query)
      );
    }
    
    // Фильтрация по категории
    if (params.category) {
      products = products.filter(p => p.category === params.category);
    }
    
    // Фильтрация по цене
    if (params.minPrice) {
      products = products.filter(p => p.price >= params.minPrice);
    }
    
    if (params.maxPrice) {
      products = products.filter(p => p.price <= params.maxPrice);
    }
    
    // Фильтрация по наличию
    if (params.inStock) {
      products = products.filter(p => p.inStock);
    }
    
    // Сортировка
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'popular':
          products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
          break;
      }
    }
    
    // Пагинация
    const perPage = params.per_page || 8;
    const page = params.page || 1;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    return {
      products: products.slice(start, end),
      total: products.length,
      page,
      per_page: perPage
    };
  }
};