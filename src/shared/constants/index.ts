// src/shared/constants/index.ts
// App-wide constants

export const APP_NAME = 'AI-Do';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    TASKS: 'tasks',
    THEME: 'theme_preference',
    POMO_PRESETS: 'pomo_presets',
    POMO_SESSIONS: 'pomo_sessions',
} as const;

// Validation
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_TITLE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// Timer defaults
export const TIMER_DEFAULTS = {
    POMODORO_DURATION: 25 * 60, // 25 minutes in seconds
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
} as const;
