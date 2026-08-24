export interface CartItemRequest {
    productId: number;
    quantity: number;
}

export interface CartItemResponse {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
}

export interface UpdateQuantityRequest {
    quantity: number;
}
