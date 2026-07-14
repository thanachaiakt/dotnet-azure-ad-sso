import { useState, useEffect, useCallback, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import type { Product, ProductFilters } from '../types/product';
import {
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchBrands,
    setAuthToken,
} from '../services/productApi';
import { loginRequest, apiRequest } from '../authConfig';

/**
 * Acquires an access token silently using MSAL and sets it on the API client.
 */
const useAccessToken = () => {
    const { instance, accounts } = useMsal();

    const acquireToken = useCallback(async () => {
        if (accounts.length === 0) return null;
        try {
            const response = await instance.acquireTokenSilent({
                ...apiRequest,
                account: accounts[0],
            });
            setAuthToken(response.accessToken);
            return response.accessToken;
        } catch (error) {
            console.error('Failed to acquire token silently:', error);
            // Fallback to interactive login
            try {
                const response = await instance.acquireTokenPopup({
                    ...apiRequest,
                    account: accounts[0],
                });
                setAuthToken(response.accessToken);
                return response.accessToken;
            } catch (popupError) {
                console.error('Failed to acquire token via popup:', popupError);
                return null;
            }
        }
    }, [instance, accounts]);

    return { acquireToken };
};

/**
 * Hook to fetch and filter products from the API.
 */
export const useProducts = (filters: ProductFilters) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { acquireToken } = useAccessToken();
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await acquireToken();
            if (!token) {
                setError('Authentication required');
                return;
            }
            const data = await fetchProducts(filters);
            setProducts(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load products';
            setError(message);
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, acquireToken]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            loadProducts();
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [loadProducts]);

    return { products, loading, error, reload: loadProducts };
};

/**
 * Hook to fetch a single product by ID.
 */
export const useProduct = (id: number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { acquireToken } = useAccessToken();

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = await acquireToken();
                if (!token) {
                    setError('Authentication required');
                    return;
                }
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load product';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, acquireToken]);

    return { product, loading, error };
};

/**
 * Hook to fetch categories and brands for the filter panel.
 */
export const useFilterOptions = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const { acquireToken } = useAccessToken();

    useEffect(() => {
        const load = async () => {
            const token = await acquireToken();
            if (!token) return;
            try {
                const [cats, brs] = await Promise.all([
                    fetchCategories(),
                    fetchBrands(),
                ]);
                setCategories(cats);
                setBrands(brs);
            } catch (err) {
                console.error('Error loading filter options:', err);
            }
        };
        load();
    }, [acquireToken]);

    return { categories, brands };
};
