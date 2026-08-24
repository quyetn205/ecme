import { env } from '@/configs/env.config';

export function getToken(): string | null {
    return localStorage.getItem(env.TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(env.TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(env.TOKEN_KEY);
}

export function hasToken(): boolean {
    return !!getToken();
}
