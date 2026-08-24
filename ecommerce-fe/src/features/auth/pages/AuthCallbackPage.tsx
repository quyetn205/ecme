import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores';
import { userService } from '@/services';
import { setToken } from '@/utils/token';
import { ROUTE_PATH } from '@/routes/route-path';

/**
 * AuthCallbackPage: receives JWT token from Google OAuth2 redirect.
 * URL format: /auth/callback?token=<jwt>
 */
export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAuth } = useAuthStore();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error || !token) {
            toast.error(
                error === 'google_denied'
                    ? 'Đăng nhập Google bị hủy'
                    : 'Đăng nhập Google thất bại'
            );
            navigate(ROUTE_PATH.LOGIN, { replace: true });
            return;
        }

        // Save token so axios interceptor can use it for getMe()
        setToken(token);

        userService
            .getMe()
            .then((res) => {
                setAuth(token, res.result);
                toast.success('Đăng nhập Google thành công!');
                navigate(ROUTE_PATH.HOME, { replace: true });
            })
            .catch(() => {
                toast.error('Không thể lấy thông tin người dùng');
                navigate(ROUTE_PATH.LOGIN, { replace: true });
            });
    }, [navigate, searchParams, setAuth]);

    return (
        <div className='flex min-h-screen items-center justify-center'>
            <div className='text-center'>
                <div className='mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
                <p className='mt-4 text-gray-600'>Đang xử lý đăng nhập Google...</p>
            </div>
        </div>
    );
}
