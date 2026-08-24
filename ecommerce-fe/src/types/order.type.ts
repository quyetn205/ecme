export interface OrderRequest {
    cartItemIds: number[];
    fullName: string;
    phoneNumber: string;
    address: string;
}

export interface OrderItemResponse {
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    priceAtOrder: number;
}

export interface OrderResponse {
    id: number;
    orderDate: string;
    status: string;
    totalPrice: number;
    fullName: string;
    phoneNumber: string;
    address: string;
    items: OrderItemResponse[];
}
