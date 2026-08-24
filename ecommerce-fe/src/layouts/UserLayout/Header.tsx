import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, Shield } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from '@/routes/route-path';

export default function Header() {
    const { isAuthenticated, user, logout, roles } = useAuthStore();
    const isStaff = roles.some((role) => ['ADMIN', 'EMPLOYEE'].includes(role.toUpperCase()));

    return (
        <header className='sticky top-0 z-40 border-b bg-white shadow-sm'>
            <div className='container-page mx-auto flex h-16 items-center justify-between px-4'>
                {/* Logo */}
                <Link
                    to={ROUTE_PATH.HOME}
                    className='text-xl font-bold text-primary'
                >
                    E-Commerce
                </Link>

                {/* Navigation */}
                <nav className='hidden items-center gap-6 md:flex'>
                    <Link
                        to={ROUTE_PATH.HOME}
                        className='text-sm font-medium text-gray-700 hover:text-primary'
                    >
                        Sản phẩm
                    </Link>
                    <Link
                        to={ROUTE_PATH.ORDER_LIST}
                        className='text-sm font-medium text-gray-700 hover:text-primary'
                    >
                        Đơn hàng
                    </Link>
                    {isStaff && (
                        <Link
                            to={ROUTE_PATH.ADMIN_DASHBOARD}
                            className='flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary'
                        >
                            <Shield className='h-4 w-4' />
                            Quản trị
                        </Link>
                    )}
                </nav>

                {/* Actions */}
                <div className='flex items-center gap-4'>
                    <Link
                        to={ROUTE_PATH.CART}
                        className='relative text-gray-700 hover:text-primary'
                    >
                        <ShoppingCart className='h-5 w-5' />
                    </Link>

                    {isAuthenticated ? (
                        <div className='flex items-center gap-3'>
                            <Link
                                to={ROUTE_PATH.PROFILE}
                                className='flex items-center gap-1 text-sm text-gray-700 hover:text-primary'
                            >
                                <User className='h-4 w-4' />
                                {user?.fullName || user?.username}
                            </Link>
                            <button
                                onClick={logout}
                                className='text-sm text-gray-500 hover:text-red-600'
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <Link
                            to={ROUTE_PATH.LOGIN}
                            className='rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90'
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
