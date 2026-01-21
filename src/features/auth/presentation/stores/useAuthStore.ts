// src/features/auth/presentation/stores/useAuthStore.ts
// Auth store integrated with Clean Architecture

import { create } from 'zustand';
import { UserProps } from '../../domain/entities/User';
import { authRepository, AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { LoginUseCase, RegisterUseCase, LogoutUseCase } from '../../domain/usecases';
import { sentryService } from '../../../../core/infrastructure/monitoring/sentryService';

// Create use cases
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

interface AuthState {
    user: UserProps | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    isOnboardingComplete: boolean;
    error: string | null;

    // Actions
    hydrateAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    setUser: (user: UserProps) => void;
    updateUser: (updates: Partial<UserProps>) => void;
    completeOnboarding: () => Promise<void>;
    forgotPassword: (email: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
    isOnboardingComplete: false,
    error: null,

    hydrateAuth: async () => {
        try {
            const tokensResult = await authRepository.getStoredTokens();
            const userResult = await authRepository.getCurrentUser();
            const onboardingComplete = await authRepository.isOnboardingComplete();

            if (tokensResult.isSuccess && tokensResult.value &&
                userResult.isSuccess && userResult.value) {
                const userData = userResult.value.toJSON();

                // Set Sentry user context for crash reporting
                sentryService.setUser({
                    id: userData.id,
                    email: userData.email,
                    username: userData.name,
                });

                set({
                    user: userData,
                    token: tokensResult.value.accessToken,
                    isAuthenticated: true,
                    isInitialized: true,
                    isOnboardingComplete: onboardingComplete,
                });
            } else {
                set({
                    isInitialized: true,
                    isOnboardingComplete: onboardingComplete,
                });
            }
        } catch (error) {
            console.error('Error hydrating auth:', error);
            set({ isInitialized: true });
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        const result = await loginUseCase.execute({ email, password });

        if (result.isSuccess) {
            const { user, tokens } = result.value;
            const userData = user.toJSON();

            // Set Sentry user context for crash reporting
            sentryService.setUser({
                id: userData.id,
                email: userData.email,
                username: userData.name,
            });

            set({
                user: userData,
                token: tokens.accessToken,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        const result = await registerUseCase.execute({ email, password, name });

        if (result.isSuccess) {
            const { user, tokens } = result.value;
            const userData = user.toJSON();

            // Set Sentry user context for crash reporting
            sentryService.setUser({
                id: userData.id,
                email: userData.email,
                username: userData.name,
            });

            set({
                user: userData,
                token: tokens.accessToken,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    logout: async () => {
        await logoutUseCase.execute();

        // Clear Sentry user context on logout
        sentryService.setUser(null);

        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    setUser: (user: UserProps) => set({ user }),

    updateUser: (updates: Partial<UserProps>) => {
        const currentUser = get().user;
        if (currentUser) {
            set({ user: { ...currentUser, ...updates } });
        }
    },

    completeOnboarding: async () => {
        await authRepository.setOnboardingComplete();
        set({ isOnboardingComplete: true });
    },

    resetOnboarding: async () => {
        await authRepository.resetOnboarding();
        set({ isOnboardingComplete: false });
    },

    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        const result = await authRepository.forgotPassword(email);
        set({ isLoading: false });

        if (result.isSuccess) {
            return true;
        } else {
            set({ error: result.error.message });
            return false;
        }
    },
}));
