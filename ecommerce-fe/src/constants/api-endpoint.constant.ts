export const API_ENDPOINT = {
    AUTH: {
        TOKEN: '/auth/token'
    },
    USER: {
        REGISTER: '/users/register',
        ME: '/users/me',
        UPDATE_ME: '/users/me',
        CHANGE_PASSWORD: '/users/me/password',
        ROLES: (userId: number) => `/users/${userId}/roles`,
        GET_ALL: '/users'
    },
    PRODUCT: {
        BASE: '/products',
        BY_ID: (id: number) => `/products/${id}`
    },
    CART: {
        BASE: '/cart',
        ADD: '/cart/add',
        ITEM: (id: number) => `/cart/item/${id}`
    },
    ORDER: {
        BASE: '/orders',
        BY_ID: (id: number) => `/orders/${id}`,
        CANCEL: (id: number) => `/orders/${id}/cancel`
    },
    ROLE: {
        BASE: '/roles',
        BY_NAME: (name: string) => `/roles/${name}`
    },
    PERMISSION: {
        BASE: '/permissions',
        BY_NAME: (name: string) => `/permissions/${name}`
    },
    CATEGORY: {
        BASE: '/categories',
        BY_ID: (id: number) => `/categories/${id}`
    }
} as const;
