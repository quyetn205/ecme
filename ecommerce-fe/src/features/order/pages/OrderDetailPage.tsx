import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, XCircle } from 'lucide-react';
import { useOrder } from '@/features/order/hooks/useOrder';
import { useCancelOrder } from '@/features/order/hooks/useCancelOrder';
import OrderStatusBadge from '@/features/order/components/OrderStatusBadge';
import OrderItemCard from '@/features/order/components/OrderItemCard';
import LoadingFallback from '@/components/common/LoadingFallback';
import ErrorFallback from '@/components/common/ErrorFallback';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToggle } from '@/hooks/useToggle';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ORDER_STATUS } from '@/constants';
import { ROUTE_PATH } from '@/routes/route-path';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const orderId = Number(id);
    const { data: order, isLoading, isError, refetch } = useOrder(orderId);
    const cancelOrder = useCancelOrder();
    const [confirmOpen, toggleConfirm] = useToggle(false);

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (isError || !order) {
        return <ErrorFallback onRetry={() => refetch()} />;
    }

    const canCancel = order.status === ORDER_STATUS.PENDING;

    const handleCancel = () => {
        cancelOrder.mutate(order.id, {
            onSuccess: () => {
                toggleConfirm();
                toast.success('Hủy đơn hàng thành công');
            },
            onError: (error) => {
                toggleConfirm();
                toast.error(error?.message || 'Không thể hủy đơn hàng này');
            }
        });
    };

    return (
        <div>
            <div className='mb-6'>
                <Link
                    to={ROUTE_PATH.ORDER_LIST}
                    className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Quay lại danh sách đơn hàng
                </Link>
                <div className='mt-3 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>
                            Đơn hàng #{order.id}
                        </h1>
                        <p className='mt-1 text-sm text-gray-500'>
                            Đặt lúc {formatDate(order.orderDate)}
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <OrderStatusBadge status={order.status} />
                        {canCancel && (
                            <button
                                onClick={toggleConfirm}
                                className='inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
                            >
                                <XCircle className='h-4 w-4' />
                                Hủy đơn
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Order items */}
                <div className='lg:col-span-2'>
                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        <h2 className='mb-2 text-lg font-semibold text-gray-900'>
                            Sản phẩm đã đặt
                        </h2>
                        <div className='divide-y divide-gray-100'>
                            {order.items?.map((item) => (
                                <OrderItemCard
                                    key={item.productId}
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order info */}
                <div className='space-y-6'>
                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                            Thông tin giao hàng
                        </h2>
                        <div className='mt-4 space-y-3 text-sm'>
                            <div className='flex items-start gap-2 text-gray-600'>
                                <User className='mt-0.5 h-4 w-4 shrink-0' />
                                <span>{order.fullName}</span>
                            </div>
                            <div className='flex items-start gap-2 text-gray-600'>
                                <Phone className='mt-0.5 h-4 w-4 shrink-0' />
                                <span>{order.phoneNumber}</span>
                            </div>
                            <div className='flex items-start gap-2 text-gray-600'>
                                <MapPin className='mt-0.5 h-4 w-4 shrink-0' />
                                <span>{order.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 bg-white p-6'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                            Tổng thanh toán
                        </h2>
                        <div className='mt-4 flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>
                                Tổng cộng
                            </span>
                            <span className='text-xl font-semibold text-primary'>
                                {formatCurrency(order.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title='Hủy đơn hàng'
                message={`Bạn có chắc muốn hủy đơn hàng #${order.id}? Số lượng tồn kho sẽ được hoàn lại.`}
                confirmText='Hủy đơn'
                cancelText='Giữ lại'
                onConfirm={handleCancel}
                onCancel={toggleConfirm}
                variant='danger'
            />
        </div>
    );
}
