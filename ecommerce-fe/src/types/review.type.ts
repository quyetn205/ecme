export interface ReviewRequest {
    productId: number;
    rating: number;
    comment?: string;
}

export interface ReviewResponse {
    id: number;
    productId: number;
    rating: number;
    comment?: string;
    createdAt: string;
    userId: number;
    username: string;
    fullName: string;
}
