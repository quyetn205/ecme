import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from '@/routes/route-path';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(ROUTE_PATH.LOGIN);
    };

    return (
        <header className='fixed left-64 right-0 top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-6'>
            <h1 className='text-lg font-semibold text-gray-800'>
                Quản trị hệ thống
            </h1>
            <div className='flex items-center gap-4'>
                <Link
                    to={ROUTE_PATH.HOME}
                    className='flex items-center gap-1 text-sm text-gray-600 hover:text-primary'
                >
                    Về trang chủ
                </Link>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <User className='h-4 w-4' />
                    <span>{user?.username || 'Admin'}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-1 text-sm text-gray-500 hover:text-red-500'
                >
                    <LogOut className='h-4 w-4' />
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}
