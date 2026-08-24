import { CategoryResponse } from './category.type';
import { PaginationParams } from './common.type';

export interface ProductRequest {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    categoryId?: number;
    image?: File;
}

export interface ProductResponse {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image: string;
    category: CategoryResponse;
    averageRating?: number;
    reviewCount?: number;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    quantity: number;
}

export interface ProductFilterParams extends PaginationParams {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
}
