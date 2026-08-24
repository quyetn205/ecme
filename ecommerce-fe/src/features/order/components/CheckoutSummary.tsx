import { CartItemResponse } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { ROUTE_PATH } from '@/routes/route-path';
import { Link } from 'react-router-dom';

interface CheckoutSummaryProps {
    items: CartItemResponse[];
}

export default function CheckoutSummary({ items }: CheckoutSummaryProps) {
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
                Đơn hàng của bạn
            </h2>

            <div className='mt-4 max-h-72 space-y-3 overflow-y-auto pr-1'>
                {items.map((item) => (
                    <div key={item.id} className='flex items-center gap-3'>
                        <img
                            src={item.productImage}
                            alt={item.productName}
                            className='h-12 w-12 rounded-md border border-gray-200 object-cover'
                        />
                        <div className='flex-1'>
                            <p className='text-sm font-medium text-gray-900'>
                                {item.productName}
                            </p>
                            <p className='text-xs text-gray-500'>
                                {item.quantity} x {formatCurrency(item.price)}
                            </p>
                        </div>
                        <span className='text-sm font-semibold text-gray-900'>
                            {formatCurrency(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            <div className='my-4 border-t border-gray-200' />

            <div className='space-y-2 text-sm'>
                <div className='flex justify-between text-gray-600'>
                    <span>Số lượng sản phẩm</span>
                    <span>{itemsCount}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
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
                to={ROUTE_PATH.CART}
                className='mt-4 block text-center text-sm text-gray-500 hover:text-primary'
            >
                ← Quay lại giỏ hàng
            </Link>
        </div>
    );
}
