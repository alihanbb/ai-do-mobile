// src/features/auth/infrastructure/repositories/AuthRepository.ts
// Auth repository implementation using secure storage

import { User, UserProps, AuthState, LoginCredentials, RegisterData } from '../../domain/entities/User';
import { IAuthRepository, AuthTokens } from '../../domain/repositories/IAuthRepository';
import { Result } from '../../../../core/domain/value-objects/Result';
import { IStorageAdapter } from '../../../../core/infrastructure/storage/IStorageAdapter';
import { secureStorage } from '../../../../core/infrastructure/storage/SecureStorageAdapter';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export class AuthRepository implements IAuthRepository {
    constructor(private readonly storage: IStorageAdapter = secureStorage) { }

    async login(credentials: LoginCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            // Simulate API call - replace with actual API integration
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock user for development
            const mockUser = User.create(credentials.email, 'Kullanıcı');
            const mockTokens: AuthTokens = {
                accessToken: 'mock-token-' + Date.now(),
            };

            // Save to storage
            await this.saveTokens(mockTokens);
            await this.storage.set(USER_DATA_KEY, mockUser.toJSON());

            return Result.ok({ user: mockUser, tokens: mockTokens });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Login failed'));
        }
    }

    async register(credentials: RegisterData): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser = User.create(credentials.email, credentials.name);
            const mockTokens: AuthTokens = {
                accessToken: 'mock-token-' + Date.now(),
            };

            await this.saveTokens(mockTokens);
            await this.storage.set(USER_DATA_KEY, mockUser.toJSON());

            return Result.ok({ user: mockUser, tokens: mockTokens });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Registration failed'));
        }
    }

    async logout(): Promise<Result<void, Error>> {
        try {
            await this.clearTokens();
            await this.storage.remove(USER_DATA_KEY);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Logout failed'));
        }
    }

    async getCurrentUser(): Promise<Result<User | null, Error>> {
        try {
            const userData = await this.storage.get<UserProps>(USER_DATA_KEY);
            if (userData) {
                return Result.ok(User.fromJSON(userData));
            }
            return Result.ok(null);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get user'));
        }
    }

    async updateUser(user: User): Promise<Result<void, Error>> {
        try {
            await this.storage.set(USER_DATA_KEY, user.toJSON());
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to update user'));
        }
    }

    async getStoredTokens(): Promise<Result<AuthTokens | null, Error>> {
        try {
            const accessToken = await this.storage.get<string>(TOKEN_KEY);
            if (accessToken) {
                const refreshToken = await this.storage.get<string>(REFRESH_TOKEN_KEY);
                return Result.ok({ accessToken, refreshToken: refreshToken || undefined });
            }
            return Result.ok(null);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get tokens'));
        }
    }

    async saveTokens(tokens: AuthTokens): Promise<Result<void, Error>> {
        try {
            await this.storage.set(TOKEN_KEY, tokens.accessToken);
            if (tokens.refreshToken) {
                await this.storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
            }
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to save tokens'));
        }
    }

    async clearTokens(): Promise<Result<void, Error>> {
        try {
            await this.storage.remove(TOKEN_KEY);
            await this.storage.remove(REFRESH_TOKEN_KEY);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to clear tokens'));
        }
    }

    async isOnboardingComplete(): Promise<boolean> {
        try {
            const value = await this.storage.get<boolean>(ONBOARDING_COMPLETE_KEY);
            return value === true;
        } catch {
            return false;
        }
    }

    async setOnboardingComplete(): Promise<void> {
        await this.storage.set(ONBOARDING_COMPLETE_KEY, true);
    }
}

// Singleton instance
export const authRepository = new AuthRepository();
