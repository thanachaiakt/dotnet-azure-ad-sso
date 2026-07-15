import axios from 'axios';
import type { Product, ProductFilters } from '../types/product';
import { productApiConfig } from '../authConfig';

const apiClient = axios.create({
    baseURL: `${productApiConfig.baseUrl}/api`,
});

/**
 * Set the authorization header for all API requests.
 * Called after acquiring a token from MSAL.
 */
export const setAuthToken = (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Clear the authorization header.
 */
export const clearAuthToken = () => {
    delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Fetch products with optional filters as query string parameters.
 */
export const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
    const params: Record<string, string | number | boolean> = {};

    if (filters?.name) params.name = filters.name;
    if (filters?.category) params.category = filters.category;
    if (filters?.brand) params.brand = filters.brand;
    if (filters?.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters?.inStock !== undefined) params.inStock = filters.inStock;

    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
};

/**
 * Fetch a single product by ID.
 */
export const fetchProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
};

/**
 * Fetch all distinct categories.
 */
export const fetchCategories = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data;
};

/**
 * Fetch all distinct brands.
 */
export const fetchBrands = async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/brands');
    return response.data;
};
