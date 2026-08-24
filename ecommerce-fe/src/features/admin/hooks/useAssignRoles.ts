import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userService } from '@/services';
import { UserRoleRequest } from '@/types';

const QUERY_KEY = 'users';

export function useAssignRoles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            userId,
            data
        }: {
            userId: number;
            data: UserRoleRequest;
        }) => userService.assignRoles(userId, data),
        onSuccess: () => {
            toast.success('Cập nhật vai trò thành công');
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        },
        onError: (error: unknown) => {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            const message = axiosError.response?.data?.message;
            toast.error(message || 'Cập nhật vai trò thất bại');
        }
    });
}
