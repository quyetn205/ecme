import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userService } from '@/services';
import { useAuthStore } from '@/stores';
import { UserUpdateRequest } from '@/types';

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: async (data: UserUpdateRequest) => {
            const response = await userService.updateProfile(data);
            return response.result;
        },
        onSuccess: (user) => {
            // Update user in both auth store and profile query cache
            setUser(user);
            queryClient.setQueryData(['profile'], user);
            toast.success('Cập nhật thông tin thành công');
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Cập nhật thông tin thất bại');
        }
    });
}
