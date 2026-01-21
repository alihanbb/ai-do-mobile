import { User, UserProps, RegisterData } from '../../domain/entities/User';
import { IAuthRepository, AuthTokens, LoginCredentials } from '../../domain/repositories/IAuthRepository';
import { Result } from '../../../../core/domain/value-objects/Result';
import { IStorageAdapter } from '../../../../core/infrastructure/storage/IStorageAdapter';
import { secureStorage } from '../../../../core/infrastructure/storage/SecureStorageAdapter';
import { identityApi } from '../api/identityApi';
import { AuthResponseDto } from '../api/apiTypes';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export class AuthRepository implements IAuthRepository {
    constructor(private readonly storage: IStorageAdapter = secureStorage) { }

    private mapResponseToUser(response: AuthResponseDto): User {
        return User.fromJSON({
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            avatar: response.user.avatarUrl || undefined,
            createdAt: new Date(response.user.createdAt),
            updatedAt: new Date(),
        });
    }

    async login(credentials: LoginCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            const result = await identityApi.login({
                email: credentials.email,
                password: credentials.password,
            });

            if (!result.success || !result.data) {
                return Result.fail(new Error(result.error?.message || 'Login failed'));
            }

            const response = result.data;
            const user = this.mapResponseToUser(response);
            const tokens: AuthTokens = {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            };

            await this.saveTokens(tokens);
            await this.storage.set(USER_DATA_KEY, user.toJSON());

            return Result.ok({ user, tokens });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Login failed'));
        }
    }

    async register(credentials: RegisterData): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            const result = await identityApi.register({
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
            });

            if (!result.success || !result.data) {
                return Result.fail(new Error(result.error?.message || 'Registration failed'));
            }

            const response = result.data;
            const user = this.mapResponseToUser(response);
            const tokens: AuthTokens = {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            };

            await this.saveTokens(tokens);
            await this.storage.set(USER_DATA_KEY, user.toJSON());

            return Result.ok({ user, tokens });
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

    async resetOnboarding(): Promise<void> {
        await this.storage.remove(ONBOARDING_COMPLETE_KEY);
    }

    async forgotPassword(email: string): Promise<Result<void, Error>> {
        try {
            const result = await identityApi.forgotPassword({ email });
            if (!result.success) {
                return Result.fail(new Error(result.error?.message || 'Password reset request failed'));
            }
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Password reset request failed'));
        }
    }
}

export const authRepository = new AuthRepository();
