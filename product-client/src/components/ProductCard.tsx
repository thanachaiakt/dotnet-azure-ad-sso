import { Link } from 'react-router';
import type { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
}

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

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-card-image-wrapper">
                <img
                    className="product-card-image"
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,' + encodeURIComponent(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" fill="%23141c37"><rect width="600" height="400"/><text x="300" y="200" text-anchor="middle" fill="%2364748b" font-size="20" font-family="sans-serif">No Image</text></svg>'
                            );
                    }}
                />
                <div className="stock-badge">
                    {product.inStock ? (
                        <span className="badge badge-success">
                            <span className="dot dot-success" />
                            In Stock
                        </span>
                    ) : (
                        <span className="badge badge-danger">
                            <span className="dot dot-danger" />
                            Out of Stock
                        </span>
                    )}
                </div>
            </div>
            <div className="product-card-body">
                <span className="product-card-brand">{product.brand}</span>
                <span className="product-card-name">{product.name}</span>
                <div className="product-card-footer">
                    <span className="product-card-price">
                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <div className="product-card-rating">
                        <StarRating rating={product.rating} />
                        <span>({product.reviewCount.toLocaleString()})</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
