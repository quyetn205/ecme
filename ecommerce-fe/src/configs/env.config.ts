export const env = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'E-Commerce',
    TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || 'access_token',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.1'
} as const;
