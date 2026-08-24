import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { APIResponse } from '@/types';

export interface DailyRevenue {
    date: string;
    revenue: number;
}

export const useRevenueChart = () => {
    return useQuery({
        queryKey: ['dashboard-revenue-chart'],
        queryFn: async () => {
            const res = await httpClient.get<APIResponse<DailyRevenue[]>>(
                '/dashboard/revenue-chart'
            );
            return res.data.result;
        }
    });
};
