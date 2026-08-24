import React from 'react';

// Lazy-loaded pages for code splitting
// Auth pages (implemented)
export const LoginPage = React.lazy(
    () => import('@/features/auth/pages/LoginPage')
);
export const RegisterPage = React.lazy(
    () => import('@/features/auth/pages/RegisterPage')
);
export const AuthCallbackPage = React.lazy(
    () => import('@/features/auth/pages/AuthCallbackPage')
);

// Product feature (implemented)
export const ProductListPage = React.lazy(
    () => import('@/features/product/pages/ProductListPage')
);
export const ProductDetailPage = React.lazy(
    () => import('@/features/product/pages/ProductDetailPage')
);
export const ProductManagePage = React.lazy(
    () => import('@/features/product/pages/ProductManagePage')
);

// Cart feature (implemented)
export const CartPage = React.lazy(
    () => import('@/features/cart/pages/CartPage')
);

// Order feature (implemented)
export const CheckoutPage = React.lazy(
    () => import('@/features/order/pages/CheckoutPage')
);
export const OrderListPage = React.lazy(
    () => import('@/features/order/pages/OrderListPage')
);
export const OrderDetailPage = React.lazy(
    () => import('@/features/order/pages/OrderDetailPage')
);

// User feature (implemented)
export const ProfilePage = React.lazy(
    () => import('@/features/user/pages/ProfilePage')
);

// Admin feature (implemented)
export const AdminDashboardPage = React.lazy(
    () => import('@/features/admin/pages/AdminDashboardPage')
);
export const UserManagePage = React.lazy(
    () => import('@/features/admin/pages/UserManagePage')
);
export const CategoryManagePage = React.lazy(
    () => import('@/features/admin/pages/CategoryManagePage')
);
export const AdminOrderManagePage = React.lazy(
    () => import('@/features/admin/pages/AdminOrderManagePage')
);
