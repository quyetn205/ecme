import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';

interface CartSummaryProps {
    itemsCount: number;
    totalPrice: number;
    isCheckoutDisabled?: boolean;
}

export default function CartSummary({
    itemsCount,
    totalPrice,
    isCheckoutDisabled
}: CartSummaryProps) {
    return (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
                Tóm tắt đơn hàng
            </h2>

            <div className='mt-4 space-y-2'>
                <div className='flex justify-between text-sm text-gray-600'>
                    <span>Số lượng sản phẩm</span>
                    <span>{itemsCount}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                    <span>Phí vận chuyển</span>
                    <span className='text-green-600'>Miễn phí</span>
                </div>
            </div>

            <div className='my-4 border-t border-gray-200' />

            <div className='flex justify-between'>
                <span className='text-base font-medium text-gray-900'>
                    Tổng cộng
                </span>
                <span className='text-xl font-semibold text-primary'>
                    {formatCurrency(totalPrice)}
                </span>
            </div>

            <Link
                to={isCheckoutDisabled ? ROUTE_PATH.CART : ROUTE_PATH.CHECKOUT}
                className='mt-6 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
                aria-disabled={isCheckoutDisabled}
            >
                <span className='inline-flex items-center gap-2'>
                    <ShoppingBag className='h-4 w-4' />
                    Tiến hành đặt hàng
                </span>
            </Link>
        </div>
    );
}
