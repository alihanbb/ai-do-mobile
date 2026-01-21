/**
 * Complete Focus Session Use Case
 * Marks a session as complete and updates duration
 */
import { UseCase } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { FocusSession } from '../../domain/entities/FocusSession';
import { IFocusRepository } from '../../domain/repositories/IFocusRepository';

export interface CompleteFocusSessionRequest {
    sessionId: string;
    durationSeconds: number;
}

export class CompleteFocusSession implements UseCase<CompleteFocusSessionRequest, Result<FocusSession>> {
    constructor(private readonly repository: IFocusRepository) { }

    async execute(request: CompleteFocusSessionRequest): Promise<Result<FocusSession>> {
        const getResult = await this.repository.getById(request.sessionId);

        if (getResult.isFailure) {
            return Result.fail(getResult.error);
        }

        const existingSession = getResult.value;
        if (!existingSession) {
            return Result.fail(new Error('Session not found'));
        }

        const completedSession = existingSession.complete(request.durationSeconds);

        const saveResult = await this.repository.save(completedSession);

        if (saveResult.isFailure) {
            return Result.fail(saveResult.error);
        }

        return Result.ok(completedSession);
    }
}
