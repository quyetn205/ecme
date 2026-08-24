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
        >(API_ENDPOINT.AUTH.TOKEN, data);
        return response.data;
    }
};
