export interface UserDto {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
    emailVerified: boolean;
    createdAt: string;
}

export interface AuthResponseDto {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
    };
}
