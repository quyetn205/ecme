import { UserResponse } from '@/types';
import { hasTokenRole, isAdminFromToken, getRolesFromToken } from './jwt';

/**
 * Check if the user has a role.
 * Roles are derived from the JWT scope claim (ROLE_* authorities).
 */
export function hasRole(user: UserResponse | null, roleName: string): boolean {
    if (!user) return false;
    return hasTokenRole(roleName);
}

export function isAdmin(user: UserResponse | null): boolean {
    if (!user) return false;
    return isAdminFromToken();
}

export { hasTokenRole, isAdminFromToken, getRolesFromToken };
