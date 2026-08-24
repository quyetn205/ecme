import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from './route-path';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTE_PATH.LOGIN}
                state={{ from: location }}
                replace
            />
        );
    }

    return children ? <>{children}</> : <Outlet />;
}
