import { User } from '../entities/User';
import { IAuthRepository, LoginCredentials, AuthTokens } from '../repositories/IAuthRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export class LoginUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async execute(credentials: LoginCredentials): Promise<Result<{ user: User; tokens: AuthTokens }, Error>> {
        try {
            if (!credentials.email.trim()) {
                return Result.fail(new Error('Email is required'));
            }
            if (!credentials.password) {
                return Result.fail(new Error('Password is required'));
            }

            return await this.authRepository.login({
                email: credentials.email.toLowerCase().trim(),
                password: credentials.password,
            });
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
