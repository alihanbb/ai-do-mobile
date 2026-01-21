import { apiClient, parseApiError, ApiError } from '../../../../core/infrastructure/api/apiClient';
import {
    UserPreferencesDto,
    UpdateThemeRequest,
    UpdateThemeResponse,
    UpdateLanguageRequest,
    UpdateLanguageResponse,
    UpdateNotificationsRequest,
    NotificationsDto,
    UpdateWorkingHoursRequest,
    WorkingHoursDto,
    UserProfileDto,
    UpdateProfileRequest,
} from './userApiTypes';

export interface UserApiResult<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

class UserApi {
    private readonly basePath = 'v1/users/me';

    // ============ Profile ============

    async getProfile(): Promise<UserApiResult<UserProfileDto>> {
        try {
            const response = await apiClient.get<UserProfileDto>(this.basePath);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updateProfile(request: UpdateProfileRequest): Promise<UserApiResult<UserProfileDto>> {
        try {
            const response = await apiClient.put<UserProfileDto>(this.basePath, request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Preferences ============

    // ============ Preferences ============

    async getPreferences(): Promise<UserApiResult<UserPreferencesDto>> {
        try {
            const response = await apiClient.get<UserPreferencesDto>('settings');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updatePreferences(preferences: Partial<UserPreferencesDto>): Promise<UserApiResult<UserPreferencesDto>> {
        try {
            // Note: There is no bulk update endpoint for settings in backend currently
            // We should use specific endpoints or create a bulk one.
            // For now, let's assume this might fail or we need to implementation specific calls
            // based on what changed. But let's keep the interface.
            // If backend doesn't support bulk update, this will 404.
            const response = await apiClient.put<UserPreferencesDto>('settings', preferences);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Granular Preference Updates ============

    async updateTheme(request: UpdateThemeRequest): Promise<UserApiResult<UpdateThemeResponse>> {
        try {
            const response = await apiClient.put<UpdateThemeResponse>('settings/theme', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updateLanguage(request: UpdateLanguageRequest): Promise<UserApiResult<UpdateLanguageResponse>> {
        try {
            const response = await apiClient.put<UpdateLanguageResponse>('settings/language', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updateNotifications(request: UpdateNotificationsRequest): Promise<UserApiResult<NotificationsDto>> {
        try {
            const response = await apiClient.put<NotificationsDto>('settings/notifications', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updateWorkingHours(request: UpdateWorkingHoursRequest): Promise<UserApiResult<WorkingHoursDto>> {
        try {
            const response = await apiClient.put<WorkingHoursDto>('settings/working-hours', request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Avatar ============

    async uploadAvatar(imageUri: string): Promise<UserApiResult<UserProfileDto>> {
        try {
            const formData = new FormData();

            // Get filename and type from URI
            const filename = imageUri.split('/').pop() || 'profile.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // React Native FormData format for file upload
            // @ts-ignore - React Native specific format
            formData.append('file', {
                uri: imageUri,
                name: filename,
                type: type,
            });

            const response = await apiClient.post<UserProfileDto>(
                `${this.basePath}/avatar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Avatar upload error:', error);
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Account ============

    async changePassword(currentPassword: string, newPassword: string): Promise<UserApiResult<void>> {
        try {
            await apiClient.put(`${this.basePath}/password`, { currentPassword, newPassword });
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async deleteAccount(): Promise<UserApiResult<void>> {
        try {
            await apiClient.delete(this.basePath);
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }
}

export const userApi = new UserApi();
