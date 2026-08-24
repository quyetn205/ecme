import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrders } from '@/features/order/hooks/useOrders';
import { useCancelOrder } from '@/features/order/hooks/useCancelOrder';
import OrderCard from '@/features/order/components/OrderCard';
import OrderEmptyState from '@/features/order/components/OrderEmptyState';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ROUTE_PATH } from '@/routes/route-path';
import toast from 'react-hot-toast';

export default function OrderListPage() {
    const { data, isLoading, isError, refetch } = useOrders();
    const cancelOrder = useCancelOrder();
    const [cancelId, setCancelId] = useState<number | null>(null);

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const orders = data ?? [];

    if (orders.length === 0) {
        return <OrderEmptyState />;
    }

    const handleConfirmCancel = () => {
        if (!cancelId) return;
        cancelOrder.mutate(cancelId, {
            onSuccess: () => {
                setCancelId(null);
                toast.success('Hủy đơn hàng thành công');
            },
            onError: (error) => {
                setCancelId(null);
                toast.error(error?.message || 'Không thể hủy đơn hàng này');
            }
        });
    };

    return (
        <div>
            <div className='mb-6 flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>
                        Đơn hàng của tôi
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Theo dõi và quản lý các đơn hàng đã đặt
                    </p>
                </div>
                <Link
                    to={ROUTE_PATH.HOME}
                    className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Tiếp tục mua sắm
                </Link>
            </div>

            <div className='space-y-4'>
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onCancel={setCancelId}
                    />
                ))}
            </div>

            <ConfirmDialog
                open={cancelId !== null}
                title='Hủy đơn hàng'
                message='Bạn có chắc muốn hủy đơn hàng này? Số lượng tồn kho sẽ được hoàn lại.'
                confirmText='Hủy đơn'
                cancelText='Giữ lại'
                onConfirm={handleConfirmCancel}
                onCancel={() => setCancelId(null)}
                variant='danger'
            />
        </div>
    );
}
