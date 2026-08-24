import { ORDER_STATUS } from '@/constants';

const statusStyles: Record<string, string> = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ORDER_STATUS.PROCESSING]: 'bg-blue-100 text-blue-800',
    [ORDER_STATUS.SHIPPING]: 'bg-indigo-100 text-indigo-800',
    [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
    [ORDER_STATUS.PENDING]: 'Chờ xử lý',
    [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
    [ORDER_STATUS.SHIPPING]: 'Đang giao hàng',
    [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

interface OrderStatusBadgeProps {
    status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                statusStyles[status] ?? 'bg-gray-100 text-gray-700'
            }`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}
