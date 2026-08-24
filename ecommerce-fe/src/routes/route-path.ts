export const ROUTE_PATH = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    AUTH_CALLBACK: '/auth/callback',

    // User
    HOME: '/',
    PRODUCT_DETAIL: (id: number) => `/products/${id}`,
    CART: '/cart',
    CHECKOUT: '/checkout',
    ORDER_LIST: '/orders',
    ORDER_DETAIL: (id: number) => `/orders/${id}`,
    PROFILE: '/profile',

    // Admin
    ADMIN_DASHBOARD: '/admin',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_USERS: '/admin/users',
    ADMIN_ROLES: '/admin/roles',
    ADMIN_PERMISSIONS: '/admin/permissions',
    ADMIN_CATEGORIES: '/admin/categories',
    ADMIN_ORDERS: '/admin/orders',

    // Fallback
    NOT_FOUND: '*'
} as const;
