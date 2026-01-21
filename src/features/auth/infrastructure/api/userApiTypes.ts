// Types for User Preferences API

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferencesDto {
    theme: ThemeMode;
    language: string;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    workingHoursStart: string | null;
    workingHoursEnd: string | null;
    energyTrackingEnabled: boolean;
    timezone: string;
}

export interface UpdateThemeRequest {
    theme: ThemeMode;
}

export interface UpdateThemeResponse {
    theme: string;
}

export interface UpdateLanguageRequest {
    language: string;
}

export interface UpdateLanguageResponse {
    language: string;
}

export interface UpdateNotificationsRequest {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface NotificationsDto {
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface UpdateWorkingHoursRequest {
    start: string | null;
    end: string | null;
}

export interface WorkingHoursDto {
    start: string | null;
    end: string | null;
}

export interface UserProfileDto {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    preferences: UserPreferencesDto;
}

export interface UpdateProfileRequest {
    name?: string;
    avatarUrl?: string | null;
}

export interface LogoutRequest {
    refreshToken?: string;
}
