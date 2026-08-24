import { Navigate } from 'react-router-dom';
import RegisterForm from '@/features/auth/components/RegisterForm';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from '@/routes/route-path';

export default function RegisterPage() {
    const { isAuthenticated } = useAuthStore();

    // Guest only: redirect to home if already logged in
    if (isAuthenticated) {
        return <Navigate to={ROUTE_PATH.HOME} replace />;
    }

    return (
        <div>
            <h2 className='text-center text-2xl font-bold text-gray-900'>
                Tạo tài khoản
            </h2>
            <p className='mt-2 text-center text-sm text-gray-600'>
                Đăng ký tài khoản mới để mua sắm
            </p>
            <div className='mt-6'>
                <RegisterForm />
            </div>
        </div>
    );
}
