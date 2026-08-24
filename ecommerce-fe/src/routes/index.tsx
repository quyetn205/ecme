import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATH } from './route-path';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import LoadingFallback from '@/components/common/LoadingFallback';
import AuthLayout from '@/layouts/AuthLayout';
import UserLayout from '@/layouts/UserLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Lazy-loaded pages
import {
    LoginPage,
    RegisterPage,
    AuthCallbackPage,
    ProductListPage,
    ProductDetailPage,
    ProductManagePage,
    CartPage,
    CheckoutPage,
    OrderListPage,
    OrderDetailPage,
    ProfilePage,
    AdminDashboardPage,
    UserManagePage,
    CategoryManagePage,
    AdminOrderManagePage
} from './route-lazy';

export default function AppRouter() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                    <Route path={ROUTE_PATH.LOGIN} element={<LoginPage />} />
                    <Route
                        path={ROUTE_PATH.REGISTER}
                        element={<RegisterPage />}
                    />
                    <Route
                        path={ROUTE_PATH.AUTH_CALLBACK}
                        element={<AuthCallbackPage />}
                    />
                </Route>

                {/* User routes */}
                <Route element={<UserLayout />}>
                    <Route
                        path={ROUTE_PATH.HOME}
                        element={<ProductListPage />}
                    />
                    <Route
                        path='/products/:id'
                        element={<ProductDetailPage />}
                    />

                    {/* Protected user routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path={ROUTE_PATH.CART} element={<CartPage />} />
                        <Route
                            path={ROUTE_PATH.CHECKOUT}
                            element={<CheckoutPage />}
                        />
                        <Route
                            path={ROUTE_PATH.ORDER_LIST}
                            element={<OrderListPage />}
                        />
                        <Route
                            path='/orders/:id'
                            element={<OrderDetailPage />}
                        />
                        <Route
                            path={ROUTE_PATH.PROFILE}
                            element={<ProfilePage />}
                        />
                    </Route>
                </Route>

                {/* Admin routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <RoleGuard allowedRoles={['ADMIN', 'EMPLOYEE']}>
                                <AdminLayout />
                            </RoleGuard>
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path={ROUTE_PATH.ADMIN_DASHBOARD}
                        element={<AdminDashboardPage />}
                    />
                    <Route
                        path={ROUTE_PATH.ADMIN_PRODUCTS}
                        element={<ProductManagePage />}
                    />
                    <Route
                        path={ROUTE_PATH.ADMIN_ORDERS}
                        element={<AdminOrderManagePage />}
                    />
                    <Route
                        path={ROUTE_PATH.ADMIN_USERS}
                        element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                                <UserManagePage />
                            </RoleGuard>
                        }
                    />
                    <Route
                        path={ROUTE_PATH.ADMIN_CATEGORIES}
                        element={
                            <RoleGuard allowedRoles={['ADMIN']}>
                                <CategoryManagePage />
                            </RoleGuard>
                        }
                    />
                </Route>

                {/* Fallback */}
                <Route
                    path='*'
                    element={<Navigate to={ROUTE_PATH.HOME} replace />}
                />
            </Routes>
        </Suspense>
    );
}
