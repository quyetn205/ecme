import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Package, Star } from 'lucide-react';
import ProductReview from '@/features/product/components/ProductReview';
import { useProduct } from '@/features/product/hooks/useProduct';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    const { data, isLoading, isError, refetch } = useProduct(productId);
    const addToCart = useAddToCart();

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError || !data?.result) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const product = data.result;

    const handleAddToCart = () => {
        addToCart.mutate({
            productId: product.id,
            quantity: 1
        });
    };

    return (
        <div>
            {/* Breadcrumb */}
            <nav className='mb-6 flex items-center gap-1 text-sm text-gray-500'>
                <Link to={ROUTE_PATH.HOME} className='hover:text-primary'>
                    Trang chủ
                </Link>
                <ChevronRight className='h-4 w-4' />
                <span className='font-medium text-gray-900'>
                    {product.name}
                </span>
            </nav>

            <div className='rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs'>
                <div className='grid gap-8 lg:grid-cols-2'>
                    {/* Image */}
                    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 p-4'>
                        <img
                            src={product.image}
                            alt={product.name}
                            className='aspect-square w-full rounded-xl object-cover transition-transform duration-500 hover:scale-105'
                        />
                    </div>

                    {/* Info */}
                    <div className='flex flex-col'>
                        {/* Category badge */}
                        {product.category && (
                            <span className='mb-2 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600'>
                                {product.category.name}
                            </span>
                        )}

                        <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900'>
                            {product.name}
                        </h1>

                        <div className='mt-3 flex items-center gap-3'>
                            <div className='flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700'>
                                <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                                {product.averageRating
                                    ? product.averageRating.toFixed(1)
                                    : '0.0'}
                            </div>
                            <span className='text-xs text-gray-400'>|</span>
                            <span className='text-xs font-medium text-gray-500'>
                                {product.reviewCount ?? 0} lượt đánh giá
                            </span>
                        </div>

                        {/* Price box */}
                        <div className='mt-6 rounded-2xl bg-blue-50/50 p-4 border border-blue-100/60'>
                            <span className='text-xs font-medium text-blue-600 uppercase tracking-wider'>Giá bán niêm yết</span>
                            <p className='mt-1 text-3xl font-black tracking-tight text-blue-600'>
                                {formatCurrency(product.price)}
                            </p>
                        </div>

                        <div className='mt-4 flex items-center gap-2'>
                            <Package className='h-4 w-4 text-gray-400' />
                            <span className='text-xs sm:text-sm font-medium text-gray-600'>
                                {product.quantity > 0
                                    ? `Còn ${product.quantity} sản phẩm trong kho`
                                    : 'Tạm hết hàng'}
                            </span>
                        </div>

                        {/* Trust guarantees bar */}
                        <div className='mt-6 grid grid-cols-2 gap-3 border-y border-gray-100 py-4 text-xs font-medium text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold'>✓</span>
                                <span>Chính hãng 100%</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold'>✓</span>
                                <span>Bảo hành 12 tháng</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold'>✓</span>
                                <span>Lỗi 1 đổi 1 trong 7 ngày</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600 font-bold'>✓</span>
                                <span>Giao nhanh toàn quốc</span>
                            </div>
                        </div>

                        <div className='mt-6 prose prose-sm max-w-none text-gray-600'>
                            <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>
                                Mô tả chi tiết
                            </h3>
                            <p className='mt-2 whitespace-pre-line text-sm leading-relaxed'>
                                {product.description}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0 || addToCart.isPending}
                            className='mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-95 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none'
                        >
                            <ShoppingCart className='h-5 w-5' />
                            {addToCart.isPending
                                ? 'Đang thêm...'
                                : product.quantity > 0
                                  ? 'Thêm vào giỏ hàng'
                                  : 'Hết hàng'}
                        </button>
                    </div>
                </div>
            </div>

            <ProductReview productId={product.id} />
        </div>
    );
}
