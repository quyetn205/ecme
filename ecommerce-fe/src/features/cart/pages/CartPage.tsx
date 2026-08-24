import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useUpdateQuantity } from '@/features/cart/hooks/useUpdateQuantity';
import CartItemRow from '@/features/cart/components/CartItemRow';
import CartSummary from '@/features/cart/components/CartSummary';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { ROUTE_PATH } from '@/routes/route-path';

export default function CartPage() {
    const { data, isLoading, isError, refetch } = useCart();
    const updateQuantity = useUpdateQuantity();

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const items = data?.result ?? [];

    if (items.length === 0) {
        return (
            <EmptyState
                icon={<ShoppingCart className='h-16 w-16 text-gray-300' />}
                title='Giỏ hàng trống'
                description='Bạn chưa có sản phẩm nào trong giỏ hàng.'
                action={
                    <Link
                        to={ROUTE_PATH.HOME}
                        className='inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Tiếp tục mua sắm
                    </Link>
                }
            />
        );
    }

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleUpdateQuantity = (id: number, quantity: number) => {
        updateQuantity.mutate({ id, quantity });
    };

    const handleRemove = (id: number) => {
        updateQuantity.mutate({ id, quantity: 0 });
    };

    return (
        <div>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>Giỏ hàng</h1>
                <p className='mt-1 text-sm text-gray-500'>
                    Kiểm tra lại sản phẩm trước khi đặt hàng
                </p>
            </div>

            <div className='grid gap-8 lg:grid-cols-3'>
                {/* Cart items */}
                <div className='lg:col-span-2'>
                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        <div className='hidden grid-cols-12 gap-4 border-b border-gray-200 pb-3 text-xs font-medium uppercase tracking-wide text-gray-500 md:grid'>
                            <div className='col-span-6'>Sản phẩm</div>
                            <div className='col-span-3 text-center'>
                                Số lượng
                            </div>
                            <div className='col-span-2 text-right'>
                                Thành tiền
                            </div>
                            <div className='col-span-1' />
                        </div>

                        {items.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemove}
                                isUpdating={updateQuantity.isPending}
                            />
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <CartSummary
                        itemsCount={itemsCount}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>
        </div>
    );
}
