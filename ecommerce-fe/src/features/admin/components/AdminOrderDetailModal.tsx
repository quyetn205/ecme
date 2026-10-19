import { X, MapPin, Phone, User, Package, ShoppingCart, Clock } from 'lucide-react';
import { OrderResponse } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
    SHIPPING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200'
};

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao thành công',
    CANCELLED: 'Đã hủy'
};

interface AdminOrderDetailModalProps {
    order: OrderResponse | null;
    open: boolean;
    onClose: () => void;
    onStatusChange: (orderId: number, currentStatus: string, newStatus: string) => void;
    isUpdatingStatus?: boolean;
}

export default function AdminOrderDetailModal({
    order,
    open,
    onClose,
    onStatusChange,
    isUpdatingStatus = false
}: AdminOrderDetailModalProps) {
    if (!open || !order) return null;

    const items = order.items ?? [];
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
            {/* Backdrop */}
            <div
                className='fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity'
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className='relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl transition-all overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-slate-50/70'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xs'>
                            <ShoppingCart className='h-5 w-5' />
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-lg font-bold text-gray-900'>
                                    Đơn hàng #{order.id}
                                </h3>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                        statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                    }`}
                                >
                                    {statusLabels[order.status] || order.status}
                                </span>
                            </div>
                            <p className='flex items-center gap-1.5 text-xs text-gray-500 mt-0.5'>
                                <Clock className='h-3.5 w-3.5' />
                                {formatDate(order.orderDate)}
                            </p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
                        aria-label='Đóng'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* Body Content */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                    {/* Status Changer Bar */}
                    <div className='rounded-2xl border border-blue-100 bg-blue-50/50 p-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                            <div>
                                <span className='text-xs font-semibold text-blue-900 uppercase tracking-wider'>
                                    Cập nhật trạng thái xử lý
                                </span>
                                <p className='text-xs text-blue-700 mt-0.5'>
                                    Thay đổi trạng thái để thông báo tới khách hàng
                                </p>
                            </div>
                            <div className='min-w-[180px]'>
                                <select
                                    disabled={order.status === 'CANCELLED' || isUpdatingStatus}
                                    value={order.status}
                                    onChange={(e) => onStatusChange(order.id, order.status, e.target.value)}
                                    className='block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100'
                                >
                                    {Object.keys(statusLabels).map((key) => (
                                        <option key={key} value={key}>
                                            {statusLabels[key]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className='rounded-2xl border border-gray-100 bg-gray-50/50 p-4'>
                        <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
                            Thông tin nhận hàng
                        </h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                            <div className='flex items-start gap-2.5'>
                                <User className='h-4 w-4 text-gray-400 mt-0.5 shrink-0' />
                                <div>
                                    <p className='text-xs text-gray-500'>Người nhận</p>
                                    <p className='font-semibold text-gray-900'>{order.fullName}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-2.5'>
                                <Phone className='h-4 w-4 text-gray-400 mt-0.5 shrink-0' />
                                <div>
                                    <p className='text-xs text-gray-500'>Số điện thoại</p>
                                    <p className='font-semibold text-gray-900'>{order.phoneNumber}</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-2.5 sm:col-span-2'>
                                <MapPin className='h-4 w-4 text-gray-400 mt-0.5 shrink-0' />
                                <div>
                                    <p className='text-xs text-gray-500'>Địa chỉ giao hàng</p>
                                    <p className='font-medium text-gray-800'>{order.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Items List */}
                    <div>
                        <div className='flex items-center justify-between mb-3'>
                            <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Sản phẩm đã mua ({totalItemsCount} món)
                            </h4>
                        </div>

                        {items.length === 0 ? (
                            <div className='rounded-2xl border border-dashed border-gray-200 p-8 text-center'>
                                <Package className='mx-auto h-8 w-8 text-gray-300' />
                                <p className='mt-2 text-sm text-gray-500'>Không có thông tin chi tiết sản phẩm.</p>
                            </div>
                        ) : (
                            <div className='divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-2xs'>
                                {items.map((item, index) => (
                                    <div key={item.productId || index} className='flex items-center gap-4 p-4 hover:bg-gray-50/70 transition-colors'>
                                        <div className='h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50'>
                                            <img
                                                src={item.productImage || 'https://via.placeholder.com/100?text=SP'}
                                                alt={item.productName}
                                                className='h-full w-full object-cover'
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=SP';
                                                }}
                                            />
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <h5 className='text-sm font-semibold text-gray-900 truncate'>
                                                {item.productName}
                                            </h5>
                                            <p className='text-xs text-gray-500 mt-0.5'>
                                                Đơn giá: {formatCurrency(item.priceAtOrder)}
                                            </p>
                                        </div>

                                        <div className='text-center px-3'>
                                            <span className='inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700'>
                                                x{item.quantity}
                                            </span>
                                        </div>

                                        <div className='text-right min-w-[90px]'>
                                            <span className='text-sm font-bold text-gray-900'>
                                                {formatCurrency(item.priceAtOrder * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Financial Summary */}
                    <div className='rounded-2xl border border-gray-100 bg-slate-50 p-4 space-y-2 text-sm'>
                        <div className='flex justify-between text-gray-600'>
                            <span>Tạm tính hàng hóa:</span>
                            <span>{formatCurrency(order.totalPrice)}</span>
                        </div>
                        <div className='flex justify-between text-gray-600'>
                            <span>Phí vận chuyển:</span>
                            <span className='text-emerald-600 font-medium'>Miễn phí (Freeship)</span>
                        </div>
                        <div className='border-t border-gray-200 pt-2 flex justify-between items-center text-base font-bold text-gray-900'>
                            <span>Tổng thanh toán:</span>
                            <span className='text-xl text-blue-600'>
                                {formatCurrency(order.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className='flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/50'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 active:scale-95 transition-all'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
