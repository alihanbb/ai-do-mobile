import { apiClient, parseApiError, ApiError } from '../../../../core/infrastructure/api/apiClient';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponseDto,
    RefreshTokenRequest,
    UserDto,
} from './apiTypes';

export interface IdentityApiResult<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

class IdentityApi {

    async login(request: LoginRequest): Promise<IdentityApiResult<AuthResponseDto>> {
        try {
            const response = await apiClient.post<AuthResponseDto>('auth/login', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async register(request: RegisterRequest): Promise<IdentityApiResult<AuthResponseDto>> {
        try {
            const response = await apiClient.post<AuthResponseDto>('auth/register', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async refreshToken(request: RefreshTokenRequest): Promise<IdentityApiResult<AuthResponseDto>> {
        try {
            const response = await apiClient.post<AuthResponseDto>('auth/refresh', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async getCurrentUser(): Promise<IdentityApiResult<UserDto>> {
        try {
            const response = await apiClient.get<UserDto>('auth/me');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async forgotPassword(request: { email: string }): Promise<IdentityApiResult<void>> {
        try {
            await apiClient.post('auth/forgot-password', request);
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async logout(refreshToken?: string): Promise<IdentityApiResult<void>> {
        try {
            await apiClient.post('auth/logout', { refreshToken });
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }
}

export const identityApi = new IdentityApi();
