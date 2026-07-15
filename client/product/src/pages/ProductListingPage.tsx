import { useState } from 'react';
import type { ProductFilters } from '../types/product';
import { useProducts, useFilterOptions } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';

export const ProductListingPage = () => {
    const [filters, setFilters] = useState<ProductFilters>({});
    const { products, loading, error } = useProducts(filters);
    const { categories, brands } = useFilterOptions();

    return (
        <div className="page" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {/* ── Header ── */}
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-light))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.03em',
                    marginBottom: '0.5rem'
                }}>
                    Electronics Catalog
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Browse the latest tech gadgets and electronics
                </p>
            </div>

            {/* ── Filters ── */}
            <FilterPanel
                filters={filters}
                categories={categories}
                brands={brands}
                onFiltersChange={setFilters}
                resultCount={products.length}
            />

            {/* ── Product Grid ── */}
            {loading ? (
                <div className="product-grid fade-in">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="product-card" style={{ pointerEvents: 'none' }}>
                            <div className="skeleton" style={{ height: 200, borderRadius: 0 }} />
                            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="skeleton" style={{ height: 12, width: '40%' }} />
                                <div className="skeleton" style={{ height: 16, width: '80%' }} />
                                <div className="skeleton" style={{ height: 16, width: '60%', marginTop: 8 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="empty-state glass-card" style={{ padding: '3rem' }}>
                    <div className="empty-state-icon">⚠️</div>
                    <h3>Error Loading Products</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setFilters({ ...filters })}>
                        Try Again
                    </button>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state glass-card fade-up" style={{ padding: '3rem' }}>
                    <div className="empty-state-icon">🔍</div>
                    <h3>No Products Found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Try adjusting your filters or search term
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setFilters({})}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="product-grid fade-up-delay">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};
