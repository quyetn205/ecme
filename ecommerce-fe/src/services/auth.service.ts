import { httpClient } from './http-client';
import { API_ENDPOINT } from '@/constants';
import {
    AuthenticationRequest,
    AuthenticationResponse,
    APIResponse
} from '@/types';

export const authService = {
    login: async (data: AuthenticationRequest) => {
        const response = await httpClient.post<
            APIResponse<AuthenticationResponse>
        >(API_ENDPOINT.AUTH.TOKEN, data, { withCredentials: true });
        return response.data;
    },

    /**
     * Refresh access token using refresh token stored in HttpOnly cookie.
     * Browser auto-sends the cookie — no need to manually attach it.
     */
    refresh: async () => {
        const response = await httpClient.post<
            APIResponse<AuthenticationResponse>
        >(API_ENDPOINT.AUTH.REFRESH, {}, { withCredentials: true });
        return response.data;
    },

    /**
     * Logout — clears the refresh token cookie on the server.
     */
    logout: async () => {
        await httpClient.post(API_ENDPOINT.AUTH.LOGOUT, {}, { withCredentials: true });
    }
};
