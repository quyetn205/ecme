import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { ROUTE_PATH } from './route-path';

interface RoleGuardProps {
    allowedRoles: string[];
    children?: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { isAuthenticated, roles } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to={ROUTE_PATH.LOGIN} replace />;
    }

    const hasAccess = roles.some((role) =>
        allowedRoles.some(
            (allowed) => allowed.toUpperCase() === role.toUpperCase()
        )
    );

    if (!hasAccess) {
        // User is authenticated but not authorized → redirect home
        return <Navigate to={ROUTE_PATH.HOME} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}
