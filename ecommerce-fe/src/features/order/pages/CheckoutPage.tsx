import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCreateOrder } from '@/features/order/hooks/useCreateOrder';
import { useCartStore } from '@/stores/cart.store';
import CheckoutForm from '@/features/order/components/CheckoutForm';
import CheckoutSummary from '@/features/order/components/CheckoutSummary';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import EmptyState from '@/components/common/EmptyState';
import { OrderFormData } from '@/lib/validators';
import { ROUTE_PATH } from '@/routes/route-path';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError, refetch } = useCart();
    const createOrder = useCreateOrder();
    const { clearCart } = useCartStore();

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
                description='Bạn cần có sản phẩm trong giỏ hàng để đặt hàng.'
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

    const handleSubmit = (formData: OrderFormData) => {
        // cartItemIds = id của CartItem (backend nhận CartItem id)
        const cartItemIds = items.map((item) => item.id);

        createOrder.mutate(
            {
                cartItemIds,
                ...formData
            },
            {
                onSuccess: (order) => {
                    clearCart();
                    toast.success('Đặt hàng thành công!');
                    navigate(ROUTE_PATH.ORDER_DETAIL(order.id));
                },
                onError: (error) => {
                    toast.error(
                        error?.message || 'Đặt hàng thất bại, vui lòng thử lại'
                    );
                }
            }
        );
    };

    return (
        <div>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>Thanh toán</h1>
                <p className='mt-1 text-sm text-gray-500'>
                    Điền thông tin giao hàng để hoàn tất đơn hàng
                </p>
            </div>

            <div className='grid gap-8 lg:grid-cols-3'>
                <div className='lg:col-span-2'>
                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        <CheckoutForm
                            onSubmit={handleSubmit}
                            isSubmitting={createOrder.isPending}
                        />
                    </div>
                </div>
                <div>
                    <CheckoutSummary items={items} />
                </div>
            </div>
        </div>
    );
}
