import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './env.config';
import { getToken, clearToken } from '@/utils/token';
import { toast } from 'react-hot-toast';

const httpClient = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - attach token
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
httpClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; code?: number }>) => {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    clearToken();
                    toast.error(
                        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                    );
                    window.location.href = '/auth/login';
                    break;
                case 403:
                    toast.error('Bạn không có quyền thực hiện hành động này.');
                    break;
                case 404:
                    toast.error(data?.message || 'Không tìm thấy tài nguyên.');
                    break;
                case 409:
                    toast.error(data?.message || 'Dữ liệu đã tồn tại.');
                    break;
                default:
                    toast.error(
                        data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
                    );
            }
        } else if (error.request) {
            toast.error('Không thể kết nối đến máy chủ.');
        }

        return Promise.reject(error);
    }
);

export { httpClient };
