import type { ProductFilters } from '../types/product';

interface FilterPanelProps {
    filters: ProductFilters;
    categories: string[];
    brands: string[];
    onFiltersChange: (filters: ProductFilters) => void;
    resultCount: number;
}

export const FilterPanel = ({
    filters,
    categories,
    brands,
    onFiltersChange,
    resultCount
}: FilterPanelProps) => {
    const updateFilter = (key: keyof ProductFilters, value: string | boolean | undefined) => {
        onFiltersChange({ ...filters, [key]: value || undefined });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

    return (
        <div className="fade-up">
            {/* Search + controls bar */}
            <div className="filter-bar">
                <div className="filter-search">
                    <input
                        type="text"
                        className="input"
                        placeholder="🔍  Search products..."
                        value={filters.name || ''}
                        onChange={(e) => updateFilter('name', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        className="select"
                        value={filters.brand || ''}
                        onChange={(e) => updateFilter('brand', e.target.value)}
                    >
                        <option value="">All Brands</option>
                        {brands.map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <input
                            type="checkbox"
                            checked={filters.inStock === true}
                            onChange={(e) => updateFilter('inStock', e.target.checked ? true : undefined)}
                            style={{ accentColor: 'var(--accent)' }}
                        />
                        In Stock Only
                    </label>
                </div>

                {hasActiveFilters && (
                    <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="category-pills">
                    <button
                        className={`category-pill ${!filters.category ? 'active' : ''}`}
                        onClick={() => updateFilter('category', undefined)}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-pill ${filters.category === cat ? 'active' : ''}`}
                            onClick={() => updateFilter('category', filters.category === cat ? undefined : cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <span className="results-count">
                    {resultCount} product{resultCount !== 1 ? 's' : ''} found
                </span>
            </div>
        </div>
    );
};
