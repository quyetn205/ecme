import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ImageOff, Star } from 'lucide-react';
import { ProductResponse } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';

interface ProductCardProps {
    product: ProductResponse;
    onAddToCart?: (product: ProductResponse) => void;
}

export default function ProductCard({
    product,
    onAddToCart
}: ProductCardProps) {
    const [imgError, setImgError] = useState(false);

    const stockLabel =
        product.quantity === 0
            ? { text: 'Hết hàng', cls: 'bg-red-500/90 text-white' }
            : product.quantity <= 5
              ? { text: `Còn ${product.quantity} cái`, cls: 'bg-amber-500/90 text-white' }
              : null;

    return (
        <div className='group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5'>
            {/* Image Container */}
            <Link
                to={ROUTE_PATH.PRODUCT_DETAIL(product.id)}
                className='relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50'
            >
                {imgError ? (
                    <div className='flex h-full w-full items-center justify-center bg-gray-50'>
                        <ImageOff className='h-10 w-10 text-gray-300' />
                    </div>
                ) : (
                    <img
                        src={product.image}
                        alt={product.name}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-108'
                        loading='lazy'
                        onError={() => setImgError(true)}
                    />
                )}

                {/* Stock badge */}
                {stockLabel && (
                    <span
                        className={`absolute left-2.5 top-2.5 rounded-lg px-2.5 py-1 text-[11px] font-bold backdrop-blur-md shadow-xs ${stockLabel.cls}`}
                    >
                        {stockLabel.text}
                    </span>
                )}
            </Link>

            {/* Product Info */}
            <div className='flex flex-1 flex-col pt-3 pb-1'>
                {/* Category & Rating */}
                <div className='mb-2 flex items-center justify-between text-xs'>
                    {product.category ? (
                        <span className='rounded-md bg-blue-50/80 px-2 py-0.5 font-medium text-blue-600'>
                            {product.category.name}
                        </span>
                    ) : <span />}

                    {product.averageRating && product.averageRating > 0 ? (
                        <div className='flex items-center gap-1 font-semibold text-amber-500'>
                            <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
                            <span>{product.averageRating.toFixed(1)}</span>
                        </div>
                    ) : null}
                </div>

                {/* Title */}
                <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(product.id)}
                    className='line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600'
                    title={product.name}
                >
                    {product.name}
                </Link>

                {/* Price & Action */}
                <div className='mt-auto pt-3 border-t border-gray-50'>
                    <div className='flex items-center justify-between gap-2'>
                        <div>
                            <span className='block text-[11px] text-gray-400'>Giá ưu đãi</span>
                            <p className='text-base sm:text-lg font-bold text-blue-600 tracking-tight'>
                                {formatCurrency(product.price)}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart?.(product);
                            }}
                            disabled={product.quantity === 0}
                            title={product.quantity === 0 ? 'Sản phẩm đã hết hàng' : 'Thêm vào giỏ'}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shadow-blue-500/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-90 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none'
                        >
                            <ShoppingCart className='h-4 w-4' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
