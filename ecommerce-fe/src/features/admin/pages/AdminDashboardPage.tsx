import { useState } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { useDashboardSummary } from '@/features/admin/hooks/useDashboardSummary';
import { useRevenueChart } from '@/features/admin/hooks/useRevenueChart';
import { useRecentOrders } from '@/features/admin/hooks/useRecentOrders';
import { cn } from '@/lib/cn';
import { Link } from 'react-router-dom';
import { ROUTE_PATH } from '@/routes/route-path';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface StatCard {
    label: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    description: string;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
}

function StatCardSkeleton() {
    return (
        <div className='animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='flex items-start justify-between'>
                <div className='h-12 w-12 rounded-xl bg-gray-100' />
                <div className='h-4 w-16 rounded bg-gray-100' />
            </div>
            <div className='mt-4 h-8 w-24 rounded bg-gray-100' />
            <div className='mt-2 h-4 w-32 rounded bg-gray-100' />
        </div>
    );
}

export default function AdminDashboardPage() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const { data: summaryData, isLoading: isLoadingSummary, isError: isErrorSummary } = useDashboardSummary(startDate, endDate);
    const { data: chartData, isLoading: isLoadingChart } = useRevenueChart(startDate, endDate);
    const { data: recentOrders, isLoading: isLoadingOrders } = useRecentOrders();

    const cards: StatCard[] = [
        {
            label: 'Người dùng',
            value: summaryData?.totalUsers ?? 0,
            icon: Users,
            colorClass: 'text-violet-600',
            bgClass: 'bg-violet-50',
            description: 'Tổng tài khoản đã đăng ký'
        },
        {
            label: 'Sản phẩm',
            value: summaryData?.totalProducts ?? 0,
            icon: Package,
            colorClass: 'text-blue-600',
            bgClass: 'bg-blue-50',
            description: 'Tổng sản phẩm trong kho'
        },
        {
            label: 'Đơn hàng',
            value: summaryData?.totalOrders ?? 0,
            icon: ShoppingBag,
            colorClass: 'text-amber-600',
            bgClass: 'bg-amber-50',
            description: 'Tổng đơn hàng đã tạo'
        },
        {
            label: 'Doanh thu',
            value: formatCurrency(summaryData?.totalRevenue ?? 0),
            icon: TrendingUp,
            colorClass: 'text-emerald-600',
            bgClass: 'bg-emerald-50',
            description: 'Tổng giá trị đơn hàng'
        }
    ];

    return (
        <div>
            {/* Header */}
            <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        Tổng quan hoạt động của hệ thống
                    </p>
                </div>
                
                {/* Lọc thời gian */}
                <div className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm'>
                    <div className='flex items-center gap-2'>
                        <label htmlFor='startDate' className='text-sm text-gray-600'>Từ:</label>
                        <input
                            type='date'
                            id='startDate'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    <span className='text-gray-300'>|</span>
                    <div className='flex items-center gap-2'>
                        <label htmlFor='endDate' className='text-sm text-gray-600'>Đến:</label>
                        <input
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className='rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500'
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button 
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className='ml-2 text-xs font-medium text-red-500 hover:text-red-700'
                        >
                            Xóa lọc
                        </button>
                    )}
                </div>
            </div>

            {isErrorSummary && (
                <div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                    Không thể tải dữ liệu thống kê. Vui lòng thử lại.
                </div>
            )}

            {/* Stat Cards */}
            <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                {isLoadingSummary
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <StatCardSkeleton key={i} />
                      ))
                    : cards.map((card) => {
                          const Icon = card.icon;
                          return (
                              <div
                                  key={card.label}
                                  className='group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
                              >
                                  {/* Subtle gradient accent */}
                                  <div className='absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-10 blur-2xl' />

                                  <div className='flex items-start justify-between'>
                                      <div
                                          className={cn(
                                              'flex h-12 w-12 items-center justify-center rounded-xl',
                                              card.bgClass
                                          )}
                                      >
                                          <Icon
                                              className={cn(
                                                  'h-6 w-6',
                                                  card.colorClass
                                              )}
                                          />
                                      </div>
                                      <span
                                          className={cn(
                                              'rounded-full px-2.5 py-1 text-xs font-semibold',
                                              card.bgClass,
                                              card.colorClass
                                          )}
                                      >
                                          {card.label}
                                      </span>
                                  </div>

                                  <p className='mt-4 text-3xl font-bold tracking-tight text-gray-900'>
                                      {card.value}
                                  </p>
                                  <p className='mt-1 text-sm text-gray-500'>
                                      {card.description}
                                  </p>
                              </div>
                          );
                      })}
            </div>

            {/* Coming soon sections */}
            <div className='mt-8 grid gap-5 lg:grid-cols-3'>
                {/* Revenue Chart */}
                <div className='lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <div className='mb-4 flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                            Doanh thu {startDate || endDate ? 'theo khoảng thời gian' : '7 ngày qua'}
                        </h2>
                    </div>
                    <div className='h-72 w-full'>
                        {isLoadingChart ? (
                            <div className='flex h-full items-center justify-center'>
                                <Loader2 className='h-8 w-8 animate-spin text-gray-300' />
                            </div>
                        ) : (
                            <ResponsiveContainer width='100%' height='100%'>
                                <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                                            <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                                            <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f3f4f6' />
                                    <XAxis 
                                        dataKey='date' 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 12, fill: '#6b7280' }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip 
                                        formatter={(value: any) => [formatCurrency(value), 'Doanh thu']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area 
                                        type='monotone' 
                                        dataKey='revenue' 
                                        stroke='#10b981' 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill='url(#colorRevenue)' 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                    <div className='mb-4 flex items-center justify-between'>
                        <h2 className='text-lg font-semibold text-gray-900'>Đơn hàng gần đây</h2>
                        <Link to={ROUTE_PATH.ADMIN_ORDERS} className='flex items-center text-sm font-medium text-blue-600 hover:text-blue-700'>
                            Xem tất cả <ArrowRight className='ml-1 h-4 w-4' />
                        </Link>
                    </div>
                    
                    <div className='space-y-5'>
                        {isLoadingOrders ? (
                            <div className='flex h-40 items-center justify-center'>
                                <Loader2 className='h-8 w-8 animate-spin text-gray-300' />
                            </div>
                        ) : recentOrders?.length === 0 ? (
                            <p className='text-sm text-gray-500'>Chưa có đơn hàng nào.</p>
                        ) : (
                            recentOrders?.map((order) => (
                                <div key={order.id} className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
                                            <ShoppingBag className='h-5 w-5' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium text-gray-900 line-clamp-1'>
                                                {order.fullName}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                #{order.id} • {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm font-semibold text-gray-900'>
                                            {formatCurrency(order.totalPrice)}
                                        </p>
                                        <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none ${
                                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                            order.status === 'SHIPPING' ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
