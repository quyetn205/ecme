import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './env.config';
import { getToken, setToken, clearToken } from '@/utils/token';
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

// ---------- Refresh token logic ----------

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

/**
 * Process queued requests after refresh completes.
 */
function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
}

// Response interceptor - handle 401 with automatic token refresh
httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string; code?: number }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Only attempt refresh for 401 errors on non-auth endpoints
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/token')
        ) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(httpClient(originalRequest));
                        },
                        reject
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint — cookie is sent automatically
                const response = await httpClient.post(
                    '/auth/refresh',
                    {},
                    { withCredentials: true }
                );

                const newToken = response.data?.result?.token;
                if (newToken) {
                    setToken(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return httpClient(originalRequest);
                } else {
                    throw new Error('No token in refresh response');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearToken();
                toast.error(
                    'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
                );
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other error statuses
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // This runs for /auth/token or /auth/refresh 401s (login failures)
                    clearToken();
                    if (originalRequest?.url?.includes('/auth/refresh')) {
                        // Refresh failed — redirect to login
                        window.location.href = '/auth/login';
                    }
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
