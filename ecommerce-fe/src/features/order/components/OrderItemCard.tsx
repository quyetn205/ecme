import { OrderItemResponse } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';
import { Link } from 'react-router-dom';

interface OrderItemCardProps {
    item: OrderItemResponse;
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
    return (
        <div className='flex items-center gap-4 py-3'>
            <Link
                to={ROUTE_PATH.PRODUCT_DETAIL(item.productId)}
                className='shrink-0'
            >
                <img
                    src={item.productImage}
                    alt={item.productName}
                    className='h-16 w-16 rounded-md border border-gray-200 object-cover'
                />
            </Link>
            <div className='flex-1'>
                <Link
                    to={ROUTE_PATH.PRODUCT_DETAIL(item.productId)}
                    className='text-sm font-medium text-gray-900 hover:text-primary'
                >
                    {item.productName}
                </Link>
                <p className='mt-0.5 text-xs text-gray-500'>
                    Số lượng: {item.quantity}
                </p>
                <p className='mt-0.5 text-sm font-medium text-gray-900'>
                    {formatCurrency(item.priceAtOrder)}
                </p>
            </div>
            <div className='text-right'>
                <span className='text-sm font-semibold text-gray-900'>
                    {formatCurrency(item.priceAtOrder * item.quantity)}
                </span>
            </div>
        </div>
    );
}
