// store/authStore.ts
// Re-export from new Clean Architecture location

export { useAuthStore } from '../src/features/auth/presentation/stores/useAuthStore';

// Re-export user types for convenience
export type {
    UserProps as User,
    UserSettings,
    AuthState,
    LoginCredentials,
    RegisterData,
} from '../src/features/auth/domain/entities/User';
