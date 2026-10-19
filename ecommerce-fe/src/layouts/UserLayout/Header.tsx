import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Shield, Cpu, Menu, X, LogOut, PackageCheck } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { useCart } from '@/features/cart/hooks/useCart';
import { ROUTE_PATH } from '@/routes/route-path';
import { cn } from '@/lib/cn';

export default function Header() {
    const location = useLocation();
    const { isAuthenticated, user, logout, roles } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isStaff = roles.some((role) => ['ADMIN', 'EMPLOYEE'].includes(role.toUpperCase()));

    const { data: cartData } = useCart({ enabled: isAuthenticated });
    const cartCount = isAuthenticated
        ? (cartData?.result?.reduce((sum, item) => sum + item.quantity, 0) ?? 0)
        : 0;

    const navLinks = [
        { label: 'Sản phẩm', path: ROUTE_PATH.HOME },
        { label: 'Đơn hàng', path: ROUTE_PATH.ORDER_LIST, authRequired: true }
    ];

    return (
        <header className='sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm transition-all'>
            <div className='container-page mx-auto flex h-16 items-center justify-between px-4'>
                {/* Brand Logo */}
                <Link
                    to={ROUTE_PATH.HOME}
                    className='group flex items-center gap-2.5 text-xl font-extrabold tracking-tight transition-transform active:scale-95'
                >
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105'>
                        <Cpu className='h-5 w-5' />
                    </div>
                    <div className='flex flex-col'>
                        <span className='leading-tight text-gray-900'>
                            Tech<span className='text-blue-600'>Store</span>
                        </span>
                        <span className='text-[10px] font-medium uppercase tracking-wider text-gray-400'>
                            Chính Hãng
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden items-center gap-1 md:flex'>
                    {navLinks.map((link) => {
                        if (link.authRequired && !isAuthenticated) return null;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                                        : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900'
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    {isStaff && (
                        <Link
                            to={ROUTE_PATH.ADMIN_DASHBOARD}
                            className={cn(
                                'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
                                location.pathname.startsWith('/admin')
                                    ? 'bg-purple-50 text-purple-700 font-semibold'
                                    : 'text-purple-600 hover:bg-purple-50/60'
                            )}
                        >
                            <Shield className='h-4 w-4' />
                            Quản trị
                        </Link>
                    )}
                </nav>

                {/* Desktop Actions */}
                <div className='hidden items-center gap-3 md:flex'>
                    {/* Cart Icon */}
                    <Link
                        to={ROUTE_PATH.CART}
                        className='group relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-700 shadow-xs transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600'
                        title='Giỏ hàng'
                    >
                        <ShoppingCart className='h-5 w-5 transition-transform duration-200 group-hover:scale-110' />
                        {cartCount > 0 && (
                            <span className='absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white'>
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className='flex items-center gap-2'>
                            <Link
                                to={ROUTE_PATH.PROFILE}
                                className='flex items-center gap-2 rounded-xl border border-gray-200/80 bg-gray-50/80 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-100'
                            >
                                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white'>
                                    {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className='max-w-[120px] truncate'>
                                    {user?.fullName || user?.username}
                                </span>
                            </Link>
                            <button
                                onClick={logout}
                                className='flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600'
                                title='Đăng xuất'
                            >
                                <LogOut className='h-4 w-4' />
                            </button>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Link
                                to={ROUTE_PATH.LOGIN}
                                className='rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50'
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to={ROUTE_PATH.REGISTER}
                                className='rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:opacity-95'
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu & Cart */}
                <div className='flex items-center gap-2 md:hidden'>
                    <Link
                        to={ROUTE_PATH.CART}
                        className='relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700'
                    >
                        <ShoppingCart className='h-4 w-4' />
                        {cartCount > 0 && (
                            <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white'>
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className='flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50'
                    >
                        {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className='border-t border-gray-100 bg-white px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-2'>
                    <nav className='flex flex-col space-y-2'>
                        <Link
                            to={ROUTE_PATH.HOME}
                            onClick={() => setMobileMenuOpen(false)}
                            className='rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Sản phẩm
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to={ROUTE_PATH.ORDER_LIST}
                                onClick={() => setMobileMenuOpen(false)}
                                className='rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                            >
                                Đơn hàng của tôi
                            </Link>
                        )}
                        {isStaff && (
                            <Link
                                to={ROUTE_PATH.ADMIN_DASHBOARD}
                                onClick={() => setMobileMenuOpen(false)}
                                className='flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700'
                            >
                                <Shield className='h-4 w-4' />
                                Quản trị hệ thống
                            </Link>
                        )}
                        <div className='my-2 border-t border-gray-100 pt-2' />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={ROUTE_PATH.PROFILE}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                                >
                                    <User className='h-4 w-4 text-gray-400' />
                                    Tài khoản: {user?.fullName || user?.username}
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50'
                                >
                                    <LogOut className='h-4 w-4' />
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className='grid grid-cols-2 gap-2 pt-2'>
                                <Link
                                    to={ROUTE_PATH.LOGIN}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className='rounded-lg border border-gray-200 py-2 text-center text-sm font-medium text-gray-700'
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to={ROUTE_PATH.REGISTER}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className='rounded-lg bg-blue-600 py-2 text-center text-sm font-semibold text-white'
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
