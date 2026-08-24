import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItemResponse } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface CartItemRowProps {
    item: CartItemResponse;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
    isUpdating?: boolean;
}

export default function CartItemRow({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating
}: CartItemRowProps) {
    const handleDecrease = () => {
        if (item.quantity <= 1) {
            onRemove(item.id);
        } else {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className='flex items-center gap-4 border-b border-gray-200 py-4 last:border-0'>
            {/* Product image */}
            <img
                src={item.productImage}
                alt={item.productName}
                className='h-20 w-20 rounded-md border border-gray-200 object-cover'
            />

            {/* Product name */}
            <div className='flex-1'>
                <h3 className='text-sm font-medium text-gray-900'>
                    {item.productName}
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                    {formatCurrency(item.price)}
                </p>
            </div>

            {/* Quantity control */}
            <div className='flex items-center gap-2'>
                <button
                    onClick={handleDecrease}
                    disabled={isUpdating}
                    className='rounded-md border border-gray-300 p-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50'
                    aria-label='Giảm số lượng'
                >
                    <Minus className='h-4 w-4' />
                </button>
                <span className='w-8 text-center text-sm font-medium text-gray-900'>
                    {item.quantity}
                </span>
                <button
                    onClick={handleIncrease}
                    disabled={isUpdating}
                    className='rounded-md border border-gray-300 p-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50'
                    aria-label='Tăng số lượng'
                >
                    <Plus className='h-4 w-4' />
                </button>
            </div>

            {/* Subtotal */}
            <div className='w-24 text-right'>
                <p className='text-sm font-semibold text-gray-900'>
                    {formatCurrency(item.price * item.quantity)}
                </p>
            </div>

            {/* Remove button */}
            <button
                onClick={() => onRemove(item.id)}
                disabled={isUpdating}
                className='rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50'
                aria-label='Xóa sản phẩm'
            >
                <Trash2 className='h-5 w-5' />
            </button>
        </div>
    );
}
