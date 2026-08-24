import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';
import { UserResponse } from '@/types';

export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await userService.getMe();
            return response.result as UserResponse;
        }
    });
}
