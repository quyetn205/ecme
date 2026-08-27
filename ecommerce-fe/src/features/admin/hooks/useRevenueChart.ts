import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/services/http-client';
import { APIResponse } from '@/types';

export interface DailyRevenue {
    date: string;
    revenue: number;
}

export const useRevenueChart = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['dashboard-revenue-chart', startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            
            const queryString = params.toString();
            const url = `/dashboard/revenue-chart${queryString ? `?${queryString}` : ''}`;
            
            const res = await httpClient.get<APIResponse<DailyRevenue[]>>(url);
            return res.data.result;
        }
    });
};
