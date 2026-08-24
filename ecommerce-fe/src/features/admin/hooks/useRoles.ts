import { useQuery } from '@tanstack/react-query';
import { roleService } from '@/services';

const QUERY_KEY = 'roles';

export function useRoles() {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: () => roleService.getAll()
    });
}
