// src/features/auth/domain/usecases/Register.ts
// Register use case

import { User } from '../entities/User';
import { IAuthRepository, RegisterCredentials, AuthTokens } from '../repositories/IAuthRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export class RegisterUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async execute(credentials: RegisterCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            // Validation
            if (!credentials.email.trim()) {
                return Result.fail(new Error('Email is required'));
            }
            if (!credentials.email.includes('@')) {
                return Result.fail(new Error('Invalid email format'));
            }
            if (!credentials.password || credentials.password.length < 6) {
                return Result.fail(new Error('Password must be at least 6 characters'));
            }
            if (!credentials.name.trim()) {
                return Result.fail(new Error('Name is required'));
            }

            return await this.authRepository.register({
                email: credentials.email.toLowerCase().trim(),
                password: credentials.password,
                name: credentials.name.trim(),
            });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
