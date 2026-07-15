export interface Product {
  id: number;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export interface ProductFilters {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
