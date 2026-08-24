import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services';

const QUERY_KEY = 'users';

export function useUsers() {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => userService.getAll()
    });
}
