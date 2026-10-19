import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Layers, ShoppingCart, Shield, ArrowLeft } from 'lucide-react';
import { ROUTE_PATH } from '@/routes/route-path';
import { cn } from '@/lib';
import { useAuthStore } from '@/stores';
import { isAdmin } from '@/utils/permission';

const sidebarItems = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: ROUTE_PATH.ADMIN_DASHBOARD,
        adminOnly: false
    },
    { icon: Layers, label: 'Danh mục', path: ROUTE_PATH.ADMIN_CATEGORIES, adminOnly: true },
    { icon: Package, label: 'Sản phẩm', path: ROUTE_PATH.ADMIN_PRODUCTS, adminOnly: false },
    { icon: ShoppingCart, label: 'Đơn hàng', path: ROUTE_PATH.ADMIN_ORDERS, adminOnly: false },
    { icon: Users, label: 'Người dùng', path: ROUTE_PATH.ADMIN_USERS, adminOnly: true }
];

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuthStore();
    const isUserAdmin = isAdmin(user);

    return (
        <aside className='fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-gray-100 bg-white'>
            {/* Header logo */}
            <div className='flex h-16 items-center px-5 border-b border-gray-100'>
                <Link
                    to={ROUTE_PATH.ADMIN_DASHBOARD}
                    className='flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-gray-900'
                >
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'>
                        <Shield className='h-4 w-4' />
                    </div>
                    <span>Tech<span className='text-blue-600'>Admin</span></span>
                </Link>
            </div>

            {/* Menu Items */}
            <nav className='mt-4 flex-1 space-y-1 px-3'>
                {sidebarItems.map((item) => {
                    if (item.adminOnly && !isUserAdmin) return null;

                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150',
                                isActive
                                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon className='h-5 w-5' />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Return to client store */}
            <div className='border-t border-gray-100 p-3'>
                <Link
                    to={ROUTE_PATH.HOME}
                    className='flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-blue-600'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Quay lại cửa hàng
                </Link>
            </div>
        </aside>
    );
}
