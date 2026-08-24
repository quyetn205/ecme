import { Navigate } from 'react-router-dom';
import LoginForm from '@/features/auth/components/LoginForm';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from '@/routes/route-path';

export default function LoginPage() {
    const { isAuthenticated } = useAuthStore();

    // Guest only: redirect to home if already logged in
    if (isAuthenticated) {
        return <Navigate to={ROUTE_PATH.HOME} replace />;
    }

    return (
        <div>
            <h2 className='text-center text-2xl font-bold text-gray-900'>
                Đăng nhập
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
                Nhập thông tin tài khoản của bạn để tiếp tục
            </p>
            <div className='mt-6'>
                <LoginForm />
            </div>
        </div>
    );
}
