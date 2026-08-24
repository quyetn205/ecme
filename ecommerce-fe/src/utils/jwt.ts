import { getToken } from './token';

interface JwtPayload {
    sub?: string;
    userId?: number;
    scope?: string;
    iss?: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
}

function decodePayload(token: string): JwtPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(
                    (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
}

export function getTokenPayload(): JwtPayload | null {
    const token = getToken();
    if (!token) return null;
    return decodePayload(token);
}

/**
 * Extract roles from JWT scope claim.
 * Backend stores scope as: "ROLE_ADMIN ROLE_USER permission1 permission2"
 * We only pick authorities starting with "ROLE_".
 */
export function getRolesFromToken(): string[] {
    const payload = getTokenPayload();
    if (!payload?.scope) return [];
    return payload.scope
        .split(' ')
        .filter(Boolean)
        .filter((item) => item.startsWith('ROLE_'))
        .map((item) => item.replace('ROLE_', ''));
}

export function hasTokenRole(role: string): boolean {
    return getRolesFromToken().some(
        (r) => r.toUpperCase() === role.toUpperCase()
    );
}

export function isAdminFromToken(): boolean {
    return hasTokenRole('ADMIN');
}
