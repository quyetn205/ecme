import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { APIResponse } from '@/types';

export interface DashboardSummary {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async () => {
            const res = await httpClient.get<APIResponse<DashboardSummary>>(
                '/dashboard/summary'
            );
            return res.data.result;
        }
    });
};
