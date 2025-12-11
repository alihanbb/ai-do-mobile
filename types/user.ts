// types/user.ts
// Re-export from new Clean Architecture location for backward compatibility

export type {
    UserProps as User,
    UserPreferences,
    UserSettings,
    AuthState,
    LoginCredentials,
    RegisterData,
} from '../src/features/auth/domain/entities/User';
