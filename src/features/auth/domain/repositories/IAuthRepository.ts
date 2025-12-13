import { User } from '../entities/User';
import { Result } from '../../../../core/domain/value-objects/Result';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>>;
    register(credentials: RegisterCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>>;
    logout(): Promise<Result<void, Error>>;
    getCurrentUser(): Promise<Result<User | null, Error>>;
    updateUser(user: User): Promise<Result<void, Error>>;
    getStoredTokens(): Promise<Result<AuthTokens | null, Error>>;
    saveTokens(tokens: AuthTokens): Promise<Result<void, Error>>;
    clearTokens(): Promise<Result<void, Error>>;
    isOnboardingComplete(): Promise<boolean>;
    setOnboardingComplete(): Promise<void>;
}
