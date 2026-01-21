import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/config';
import { secureStorage } from '../storage/SecureStorageAdapter';

const apiClient: AxiosInstance = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

const TOKEN_KEY = config.auth.tokenKey;
const REFRESH_TOKEN_KEY = config.auth.refreshTokenKey;

apiClient.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
        try {
            const token = await secureStorage.get<string>(TOKEN_KEY);
            if (token) {
                console.log(`🔑 Found token (length: ${token.length})`);
                if (requestConfig.headers) {
                    requestConfig.headers.Authorization = `Bearer ${token}`;
                }
            } else {
                console.log('⚠️ No token found in storage');
            }
            console.log(`🌐 API Request: [${requestConfig.method?.toUpperCase()}] ${requestConfig.baseURL}${requestConfig.url}`);
            console.log('Headers:', JSON.stringify(requestConfig.headers, null, 2));
            console.log('Payload:', JSON.stringify(requestConfig.data, null, 2));
        } catch (error) {
            console.warn('Failed to get auth token:', error);
        }
        return requestConfig;
    },
    (error: unknown) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: import('axios').AxiosResponse) => {
        console.log(`✅ API Response: [${response.status}] ${response.config.url}`);
        console.log('Result Data:', JSON.stringify(response.data, null, 2));
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await secureStorage.get<string>(REFRESH_TOKEN_KEY);

                if (refreshToken) {
                    const refreshResponse = await axios.post(
                        `${config.api.baseUrl}auth/refresh`,
                        { refreshToken },
                        { headers: { 'Content-Type': 'application/json' } }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                    await secureStorage.set(TOKEN_KEY, accessToken);
                    await secureStorage.set(REFRESH_TOKEN_KEY, newRefreshToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                await secureStorage.remove(TOKEN_KEY);
                await secureStorage.remove(REFRESH_TOKEN_KEY);
                console.error('Token refresh failed:', refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { apiClient };

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export const parseApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: { code?: string; message?: string } }>;

        if (axiosError.response?.data?.error) {
            return {
                message: axiosError.response.data.error.message || 'An error occurred',
                code: axiosError.response.data.error.code,
                status: axiosError.response.status,
            };
        }

        if (axiosError.response?.status === 401) {
            return {
                message: 'Authentication failed. Please check your credentials.',
                code: 'UNAUTHORIZED',
                status: 401,
            };
        }

        if (axiosError.code === 'ECONNABORTED') {
            return {
                message: 'Request timed out. Please try again.',
                code: 'TIMEOUT',
            };
        }

        if (!axiosError.response) {
            return {
                message: 'Network error. Please check your connection.',
                code: 'NETWORK_ERROR',
            };
        }

        return {
            message: axiosError.message || 'An unexpected error occurred',
            status: axiosError.response?.status,
        };
    }

    return {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
};
