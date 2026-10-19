import { useState, useMemo } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import {
    ShoppingCart,
    Search,
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    Eye,
    Filter,
    X
} from 'lucide-react';
import LoadingFallback from '@/components/common/LoadingFallback';
import { OrderResponse } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import AdminOrderDetailModal from '../components/AdminOrderDetailModal';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
    SHIPPING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
};

const statusDotColors: Record<string, string> = {
    PENDING: 'bg-yellow-400',
    CONFIRMED: 'bg-blue-400',
    PROCESSING: 'bg-purple-400',
    SHIPPING: 'bg-indigo-400',
    DELIVERED: 'bg-emerald-500',
    CANCELLED: 'bg-rose-500'
};

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao thành công',
    CANCELLED: 'Đã hủy'
};

const STATUS_TABS = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'PROCESSING', label: 'Đang xử lý' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã hủy' }
];

export default function AdminOrderManagePage() {
    const { data: response, isLoading } = useAdminOrders();
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatusTab, setSelectedStatusTab] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const orders = useMemo(() => response?.result || [], [response]);

    // Calculate count per status
    const counts = useMemo(() => {
        const stats: Record<string, number> = { ALL: orders.length };
        orders.forEach((o: OrderResponse) => {
            stats[o.status] = (stats[o.status] || 0) + 1;
        });
        return stats;
    }, [orders]);

    // Filter orders by search & status tab
    const filteredOrders = useMemo(() => {
        return orders.filter((order: OrderResponse) => {
            const matchesStatus =
                selectedStatusTab === 'ALL' || order.status === selectedStatusTab;
            const term = searchTerm.trim().toLowerCase();
            const matchesSearch =
                !term ||
                order.id.toString().includes(term) ||
                order.fullName.toLowerCase().includes(term) ||
                order.phoneNumber.includes(term) ||
                order.address.toLowerCase().includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [orders, selectedStatusTab, searchTerm]);

    const handleStatusChange = (
        id: number,
        currentStatus: string,
        newStatus: string
    ) => {
        if (currentStatus === 'CANCELLED') return;
        if (newStatus !== currentStatus) {
            updateStatus(
                { id, status: newStatus },
                {
                    onSuccess: () => {
                        // If modal is viewing this order, update local status
                        if (selectedOrder && selectedOrder.id === id) {
                            setSelectedOrder((prev) =>
                                prev ? { ...prev, status: newStatus } : null
                            );
                        }
                    }
                }
            );
        }
    };

    const handleOpenDetail = (order: OrderResponse) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        setSelectedOrder(null);
    };

    if (isLoading) return <LoadingFallback />;

    return (
        <div className='space-y-6'>
            {/* Header & Search */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2.5'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600'>
                            <ShoppingCart className='h-5 w-5' />
                        </div>
                        Quản lý Đơn hàng
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        Theo dõi, xác nhận và cập nhật tiến độ giao vận cho toàn bộ đơn hàng
                    </p>
                </div>

                <div className='relative w-full sm:w-80'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                        <Search className='h-4 w-4 text-gray-400' />
                    </div>
                    <input
                        type='text'
                        placeholder='Tìm theo ID, tên, SĐT...'
                        className='block w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type='button'
                            onClick={() => setSearchTerm('')}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                        >
                            <X className='h-4 w-4' />
                        </button>
                    )}
                </div>
            </div>

            {/* Quick KPI Stat Cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-gray-500 uppercase'>
                            Tổng đơn hàng
                        </span>
                        <Package className='h-4 w-4 text-gray-400' />
                    </div>
                    <p className='mt-2 text-2xl font-bold text-gray-900'>{orders.length}</p>
                </div>

                <div className='rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-2xs'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-amber-800 uppercase'>
                            Chờ xác nhận
                        </span>
                        <Clock className='h-4 w-4 text-amber-500' />
                    </div>
                    <p className='mt-2 text-2xl font-bold text-amber-700'>
                        {counts['PENDING'] || 0}
                    </p>
                </div>

                <div className='rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-2xs'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-indigo-800 uppercase'>
                            Đang giao hàng
                        </span>
                        <Truck className='h-4 w-4 text-indigo-500' />
                    </div>
                    <p className='mt-2 text-2xl font-bold text-indigo-700'>
                        {counts['SHIPPING'] || 0}
                    </p>
                </div>

                <div className='rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-emerald-800 uppercase'>
                            Đã hoàn thành
                        </span>
                        <CheckCircle2 className='h-4 w-4 text-emerald-500' />
                    </div>
                    <p className='mt-2 text-2xl font-bold text-emerald-700'>
                        {counts['DELIVERED'] || 0}
                    </p>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className='flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none'>
                {STATUS_TABS.map((tab) => {
                    const count = counts[tab.key] || 0;
                    const isActive = selectedStatusTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type='button'
                            onClick={() => setSelectedStatusTab(tab.key)}
                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                                    isActive
                                        ? 'bg-blue-700 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Orders Table */}
            <div className='rounded-2xl border border-gray-100 bg-white shadow-2xs overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-100 text-left'>
                        <thead className='bg-slate-50/70'>
                            <tr>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Mã ĐH
                                </th>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Khách hàng
                                </th>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Sản phẩm
                                </th>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Ngày đặt
                                </th>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Tổng tiền
                                </th>
                                <th className='px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Trạng thái
                                </th>
                                <th className='px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 bg-white text-sm'>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order: OrderResponse) => {
                                    const itemCount = (order.items ?? []).reduce(
                                        (sum, it) => sum + it.quantity,
                                        0
                                    );
                                    return (
                                        <tr
                                            key={order.id}
                                            className='hover:bg-blue-50/30 transition-colors'
                                        >
                                            {/* Order ID */}
                                            <td className='px-5 py-4 whitespace-nowrap font-bold text-gray-900'>
                                                <span className='inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-mono font-bold text-gray-800'>
                                                    #{order.id}
                                                </span>
                                            </td>

                                            {/* Customer */}
                                            <td className='px-5 py-4 whitespace-nowrap'>
                                                <div className='font-semibold text-gray-900'>
                                                    {order.fullName}
                                                </div>
                                                <div className='text-xs text-gray-500 font-mono'>
                                                    {order.phoneNumber}
                                                </div>
                                            </td>

                                            {/* Items count & preview */}
                                            <td className='px-5 py-4'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700'>
                                                        <Package className='h-3 w-3' />
                                                        {itemCount} món
                                                    </span>
                                                </div>
                                                <p className='text-xs text-gray-500 truncate max-w-[180px] mt-0.5'>
                                                    {(order.items ?? []).map((it) => it.productName).join(', ')}
                                                </p>
                                            </td>

                                            {/* Date */}
                                            <td className='px-5 py-4 whitespace-nowrap text-xs text-gray-600'>
                                                {formatDate(order.orderDate)}
                                            </td>

                                            {/* Total Price */}
                                            <td className='px-5 py-4 whitespace-nowrap font-bold text-blue-600'>
                                                {formatCurrency(order.totalPrice)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className='px-5 py-4 whitespace-nowrap'>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                                        statusColors[order.status] ||
                                                        'bg-gray-100 text-gray-800 border-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            statusDotColors[order.status] || 'bg-gray-400'
                                                        }`}
                                                    />
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className='px-5 py-4 whitespace-nowrap text-right'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    {/* View Detail Button */}
                                                    <button
                                                        type='button'
                                                        onClick={() => handleOpenDetail(order)}
                                                        className='inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all'
                                                        title='Xem chi tiết'
                                                    >
                                                        <Eye className='h-3.5 w-3.5' />
                                                        <span>Chi tiết</span>
                                                    </button>

                                                    {/* Status Change Select */}
                                                    <select
                                                        disabled={
                                                            order.status === 'CANCELLED' || isPending
                                                        }
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                order.id,
                                                                order.status,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                                                            order.status === 'CANCELLED'
                                                                ? 'opacity-60'
                                                                : ''
                                                        }`}
                                                    >
                                                        {Object.keys(statusLabels).map((key) => (
                                                            <option key={key} value={key}>
                                                                {statusLabels[key]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className='px-6 py-14 text-center'>
                                        <Package className='mx-auto h-12 w-12 text-gray-300' />
                                        <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                                            Không có đơn hàng nào
                                        </h3>
                                        <p className='mt-1 text-xs text-gray-500'>
                                            Không tìm thấy đơn hàng phù hợp với điều kiện lọc hiện tại.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Order Detail Modal */}
            <AdminOrderDetailModal
                order={selectedOrder}
                open={isDetailOpen}
                onClose={handleCloseDetail}
                onStatusChange={handleStatusChange}
                isUpdatingStatus={isPending}
            />
        </div>
    );
}

