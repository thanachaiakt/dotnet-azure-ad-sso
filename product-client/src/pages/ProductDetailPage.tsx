import { useParams, Link } from 'react-router';
import { useProduct } from '../hooks/useProducts';

const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<span key={i} className="star filled">★</span>);
        } else if (i - 0.5 <= rating) {
            stars.push(<span key={i} className="star half">★</span>);
        } else {
            stars.push(<span key={i} className="star">★</span>);
        }
    }
    return <span className="stars">{stars}</span>;
};

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(Number(id));

    if (loading) {
        return (
            <div className="page" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
                <div className="product-detail-grid fade-in">
                    <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="skeleton" style={{ height: 16, width: '30%' }} />
                        <div className="skeleton" style={{ height: 32, width: '80%' }} />
                        <div className="skeleton" style={{ height: 32, width: '40%' }} />
                        <div className="skeleton" style={{ height: 60, width: '100%' }} />
                        <div className="skeleton" style={{ height: 100, width: '100%' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="page-center">
                <div className="glass-card fade-up" style={{ padding: '3rem', textAlign: 'center', maxWidth: 440 }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2>Product Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        {error || "The product you're looking for doesn't exist."}
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page product-detail" style={{ paddingTop: '1.5rem' }}>
            {/* ── Breadcrumb ── */}
            <div className="fade-up" style={{ marginBottom: '1.5rem' }}>
                <Link to="/products" className="btn btn-ghost" style={{ padding: '6px 0' }}>
                    ← Back to Products
                </Link>
            </div>

            {/* ── Main Grid ── */}
            <div className="product-detail-grid fade-up-delay">
                {/* Image */}
                <img
                    className="product-detail-image"
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,' + encodeURIComponent(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" fill="#141c37"><rect width="600" height="600"/><text x="300" y="300" text-anchor="middle" fill="#64748b" font-size="24" font-family="sans-serif">No Image</text></svg>'
                            );
                    }}
                />

                {/* Info */}
                <div className="product-detail-info">
                    <span className="product-detail-brand">{product.brand}</span>
                    <h1 className="product-detail-name">{product.name}</h1>

                    <div className="product-detail-price">
                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>

                    {/* Rating + Stock */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarRating rating={product.rating} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()} reviews)
                            </span>
                        </div>
                        {product.inStock ? (
                            <span className="badge badge-success">
                                <span className="dot dot-success" />
                                In Stock ({product.stock} available)
                            </span>
                        ) : (
                            <span className="badge badge-danger">
                                <span className="dot dot-danger" />
                                Out of Stock
                            </span>
                        )}
                    </div>

                    <div className="divider" />

                    {/* Description */}
                    <p className="product-detail-description">
                        {product.description}
                    </p>

                    <div className="divider" />

                    {/* Meta */}
                    <div className="product-detail-meta">
                        <div className="product-detail-meta-item">
                            <span>📦</span>
                            <span>SKU: {product.sku}</span>
                        </div>
                        <div className="product-detail-meta-item">
                            <span>🏷️</span>
                            <span>Category: {product.category}</span>
                        </div>
                        <div className="product-detail-meta-item">
                            <span>🏢</span>
                            <span>Brand: {product.brand}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
