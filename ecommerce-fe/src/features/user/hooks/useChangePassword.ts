import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userService } from '@/services';
import { ChangePasswordRequest } from '@/types';

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: ChangePasswordRequest) => {
            const response = await userService.changePassword(data);
            return response.result;
        },
        onSuccess: () => {
            toast.success('Đổi mật khẩu thành công');
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Đổi mật khẩu thất bại');
        }
    });
}
