import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ImageOff } from 'lucide-react';
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
            ? { text: 'Hết hàng', cls: 'bg-red-500 text-white' }
            : product.quantity <= 5
              ? { text: `Còn ${product.quantity}`, cls: 'bg-amber-500 text-white' }
              : null;

    return (
        <div className='group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
            <Link
                to={ROUTE_PATH.PRODUCT_DETAIL(product.id)}
                className='relative block aspect-[4/3] overflow-hidden bg-gray-100'
            >
                {imgError ? (
                    <div className='flex h-full w-full items-center justify-center bg-gray-50'>
                        <ImageOff className='h-10 w-10 text-gray-300' />
                    </div>
                ) : (
                    <img
                        src={product.image}
                        alt={product.name}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                        loading='lazy'
                        onError={() => setImgError(true)}
                    />
                )}

                {stockLabel && (
                    <span
                        className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${stockLabel.cls}`}
                    >
                        {stockLabel.text}
                    </span>
                )}
            </Link>

            <div className='flex flex-1 flex-col p-4'>
                {/* Category badge */}
                {product.category && (
                    <span className='mb-1.5 w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600'>
                        {product.category.name}
                    </span>
                )}

                <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(product.id)}
                    className='line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 transition-colors hover:text-primary'
                >
                    {product.name}
                </Link>

                <div className='mt-auto pt-3'>
                    <div className='flex items-end justify-between'>
                        <p className='text-lg font-bold text-primary'>
                            {formatCurrency(product.price)}
                        </p>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart?.(product);
                            }}
                            disabled={product.quantity === 0}
                            className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-sm disabled:active:scale-100'
                        >
                            <ShoppingCart className='h-4 w-4' />
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
