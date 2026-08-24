import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { userService } from '@/services';
import { ROUTE_PATH } from '@/routes/route-path';
import { RegisterFormData } from '@/lib/validators';
import { UserCreationRequest } from '@/types';

export function useRegister() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (data: RegisterFormData) => {
            // Strip confirmPassword before sending to backend
            const payload: UserCreationRequest = {
                username: data.username,
                password: data.password,
                fullName: data.fullName,
                email: data.email
            };
            return userService.register(payload);
        },
        onSuccess: () => {
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate(ROUTE_PATH.LOGIN, { replace: true });
        },
        onError: (error: unknown) => {
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
