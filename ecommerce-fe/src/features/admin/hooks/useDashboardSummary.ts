import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { APIResponse } from '@/types';

export interface DashboardSummary {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export const useDashboardSummary = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['dashboard-summary', startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const queryString = params.toString();
            const url = `/dashboard/summary${queryString ? `?${queryString}` : ''}`;
            
            const res = await httpClient.get<APIResponse<DashboardSummary>>(url);
            return res.data.result;
        }
    });
};
