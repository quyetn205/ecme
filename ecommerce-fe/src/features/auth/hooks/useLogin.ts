import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService, userService } from '@/services';
import { useAuthStore } from '@/stores';
import { setToken } from '@/utils/token';
import { ROUTE_PATH } from '@/routes/route-path';
import { LoginFormData } from '@/lib/validators';
import { UserResponse } from '@/types';

interface LocationState {
    from?: {
        pathname?: string;
    };
}

export function useLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuthStore()

    return useMutation({
        mutationFn: async (data: LoginFormData) => {
            // 1. Login → get JWT token
            const authResponse = await authService.login(data);
            const { token } = authResponse.result;

            // 2. Save token to localStorage so axios interceptor picks it up
            setToken(token);

            // 3. Fetch current user info
            let user: UserResponse | null = null;
            try {
                const userResponse = await userService.getMe();
                user = userResponse.result;
            } catch {
                // getMe may fail (e.g. network) — still proceed with token
                user = null;
            }

            return { token, user };
        },
        onSuccess: (data) => {
            const { token, user } = data;
            setAuth(token, user as UserResponse);

            toast.success('Đăng nhập thành công');

            // Redirect to previous page or home
            const from = (location.state as LocationState)?.from?.pathname;
            navigate(from || ROUTE_PATH.HOME, { replace: true });
        },
        onError: (error: unknown) => {
            // Specific login error messages
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            if (message) {
                toast.error(message);
            }
        }
    });
}
