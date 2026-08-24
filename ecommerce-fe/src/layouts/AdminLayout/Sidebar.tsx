import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Layers, ShoppingCart } from 'lucide-react';
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
        <aside className='fixed left-0 top-0 z-30 h-full w-64 border-r bg-white'>
            <div className='flex h-16 items-center justify-center border-b'>
                <Link
                    to={ROUTE_PATH.ADMIN_DASHBOARD}
                    className='text-xl font-bold text-primary'
                >
                    Admin Panel
                </Link>
            </div>
            <nav className='mt-4 px-3'>
                {sidebarItems.map((item) => {
                    if (item.adminOnly && !isUserAdmin) return null;

                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                        >
                            <Icon className='h-5 w-5' />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
