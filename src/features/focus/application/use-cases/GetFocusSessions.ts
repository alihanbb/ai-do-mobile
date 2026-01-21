/**
 * Get Focus Sessions Use Case
 * Retrieves all focus sessions
 */
import { UseCaseWithoutRequest } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { FocusSession } from '../../domain/entities/FocusSession';
import { IFocusRepository } from '../../domain/repositories/IFocusRepository';

export class GetFocusSessions implements UseCaseWithoutRequest<Result<FocusSession[]>> {
    constructor(private readonly repository: IFocusRepository) { }

    async execute(): Promise<Result<FocusSession[]>> {
        return this.repository.getAll();
    }
}
