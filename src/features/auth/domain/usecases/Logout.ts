// src/features/auth/domain/usecases/Logout.ts
// Logout use case

import { IAuthRepository } from '../repositories/IAuthRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export class LogoutUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async execute(): Promise<Result<void, Error>> {
        return await this.authRepository.logout();
    }
}
