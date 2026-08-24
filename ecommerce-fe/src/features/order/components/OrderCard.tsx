import { Link } from 'react-router-dom';
import { Package, ChevronRight, XCircle } from 'lucide-react';
import { OrderResponse } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ORDER_STATUS } from '@/constants';
import { ROUTE_PATH } from '@/routes/route-path';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
    order: OrderResponse;
    onCancel?: (id: number) => void;
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
    const itemsCount = order.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const canCancel = order.status === ORDER_STATUS.PENDING;

    return (
        <div className='rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <Link
                    to={ROUTE_PATH.ORDER_DETAIL(order.id)}
                    className='flex items-center gap-3'
                >
                    <Package className='h-5 w-5 text-gray-400' />
                    <div>
                        <p className='font-medium text-gray-900'>
                            Đơn hàng #{order.id}
                        </p>
                        <p className='text-sm text-gray-500'>
                            {formatDate(order.orderDate)}
                        </p>
                    </div>
                </Link>
                <div className='flex items-center gap-2'>
                    {canCancel && onCancel && (
                        <button
                            onClick={() => onCancel(order.id)}
                            className='inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50'
                        >
                            <XCircle className='h-3.5 w-3.5' />
                            Hủy
                        </button>
                    )}
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            <Link
                to={ROUTE_PATH.ORDER_DETAIL(order.id)}
                className='mt-4 flex items-center justify-between border-t border-gray-100 pt-3'
            >
                <div className='text-sm text-gray-600'>
                    <span className='font-medium'>{itemsCount}</span> sản phẩm
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-base font-semibold text-gray-900'>
                        {formatCurrency(order.totalPrice)}
                    </span>
                    <ChevronRight className='h-4 w-4 text-gray-400' />
                </div>
            </Link>
        </div>
    );
}
