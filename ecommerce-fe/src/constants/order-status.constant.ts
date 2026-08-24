export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPING: 'SHIPPING',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
