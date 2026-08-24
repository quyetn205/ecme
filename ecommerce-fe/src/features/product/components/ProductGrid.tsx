import { ProductResponse } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: ProductResponse[];
    onAddToCart?: (product: ProductResponse) => void;
}

export default function ProductGrid({
    products,
    onAddToCart
}: ProductGridProps) {
    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
