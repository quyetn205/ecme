import { create } from 'zustand';
import { UserResponse } from '@/types';
import { getToken, setToken, clearToken } from '@/utils/token';
import { getRolesFromToken } from '@/utils/jwt';
import { authService } from '@/services';

interface AuthState {
    token: string | null;
    user: UserResponse | null;
    roles: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (token: string, user: UserResponse) => void;
    setUser: (user: UserResponse) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    roles: [],
    isAuthenticated: false,
    isLoading: false,

    setAuth: (token: string, user: UserResponse) => {
        setToken(token);
        set({
            token,
            user,
            roles: getRolesFromToken(),
            isAuthenticated: true,
            isLoading: false
        });
    },

    setUser: (user: UserResponse) => {
        set({ user });
    },

    logout: () => {
        // Call backend to clear refresh token cookie (fire-and-forget)
        authService.logout().catch(() => {
            // Ignore errors — we're logging out anyway
        });
        clearToken();
        set({
            token: null,
            user: null,
            roles: [],
            isAuthenticated: false
        });
    },

    setLoading: (isLoading: boolean) => {
        set({ isLoading });
    },

    initialize: () => {
        const token = getToken();
        if (token) {
            set({
                token,
                roles: getRolesFromToken(),
                isAuthenticated: true
            });
        }
    }
}));

