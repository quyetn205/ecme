import React, { useState } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { Package, Search, ShoppingCart } from 'lucide-react';
import LoadingFallback from '@/components/common/LoadingFallback';
import { OrderResponse } from '@/types';
import { formatCurrency } from '@/utils/format';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPING: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao hàng',
    DELIVERED: 'Đã giao thành công',
    CANCELLED: 'Đã hủy'
};

export default function AdminOrderManagePage() {
    const { data: response, isLoading } = useAdminOrders();
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
    const [searchTerm, setSearchTerm] = useState('');

    const orders = response?.result || [];

    const filteredOrders = orders.filter((order: OrderResponse) => 
        order.id.toString().includes(searchTerm) || 
        order.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (id: number, currentStatus: string, newStatus: string) => {
        if (currentStatus === 'CANCELLED') return;
        if (newStatus !== currentStatus) {
            updateStatus({ id, status: newStatus });
        }
    };

    if (isLoading) return <LoadingFallback />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-indigo-600" />
                    Quản lý Đơn hàng
                </h1>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo ID hoặc tên..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã ĐH
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đặt
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order: OrderResponse) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.fullName}</div>
                                            <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.orderDate).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {formatCurrency(order.totalPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <select
                                                disabled={order.status === 'CANCELLED' || isPending}
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, order.status, e.target.value)}
                                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${order.status === 'CANCELLED' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            >
                                                {Object.keys(statusLabels).map((key) => (
                                                    <option key={key} value={key}>
                                                        {statusLabels[key]}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Package className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng</h3>
                                        <p className="mt-1 text-sm text-gray-500">Không tìm thấy đơn hàng nào phù hợp.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
