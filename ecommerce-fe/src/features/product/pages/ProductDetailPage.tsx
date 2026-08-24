import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Package, Star } from 'lucide-react';
import ProductReview from '@/features/product/components/ProductReview';
import { useProduct } from '@/features/product/hooks/useProduct';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';
import { useCartStore } from '@/stores';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const productId = Number(id);

    const { data, isLoading, isError, refetch } = useProduct(productId);
    const addItem = useCartStore((state) => state.addItem);

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError || !data?.result) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const product = data.result;

    const handleAddToCart = () => {
        addItem({
            id: 0,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            price: product.price,
            quantity: 1
        });
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
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

            <div className='grid gap-8 md:grid-cols-2'>
                {/* Image */}
                <div className='overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
                    <img
                        src={product.image}
                        alt={product.name}
                        className='aspect-square w-full object-cover'
                    />
                </div>

                {/* Info */}
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        {product.name}
                    </h1>

                    <div className='mt-2 flex items-center gap-2'>
                        <div className='flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-700'>
                            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                            {product.averageRating
                                ? product.averageRating.toFixed(1)
                                : '0.0'}
                        </div>
                        <span className='text-sm text-gray-500'>
                            ({product.reviewCount ?? 0} đánh giá)
                        </span>
                    </div>

                    <p className='mt-4 text-3xl font-semibold text-primary'>
                        {formatCurrency(product.price)}
                    </p>

                    <div className='mt-4 flex items-center gap-2'>
                        <Package className='h-4 w-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                            {product.quantity > 0
                                ? `Còn ${product.quantity} sản phẩm trong kho`
                                : 'Hết hàng'}
                        </span>
                    </div>

                    <div className='my-6 border-t border-gray-200' />

                    <div className='prose prose-sm max-w-none text-gray-700'>
                        <h3 className='text-sm font-semibold uppercase text-gray-500'>
                            Mô tả sản phẩm
                        </h3>
                        <p className='mt-2 whitespace-pre-line'>
                            {product.description}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                        className='mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        <ShoppingCart className='h-5 w-5' />
                        {product.quantity > 0
                            ? 'Thêm vào giỏ hàng'
                            : 'Hết hàng'}
                    </button>
                </div>
            </div>

            <ProductReview productId={product.id} />
        </div>
    );
}
