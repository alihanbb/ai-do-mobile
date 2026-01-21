/**
 * Start Focus Session Use Case
 * Creates a new focus session and persists it
 */
import { UseCase } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { FocusSession, FocusMode } from '../../domain/entities/FocusSession';
import { IFocusRepository } from '../../domain/repositories/IFocusRepository';

export interface StartFocusSessionRequest {
    mode: FocusMode;
    presetId?: string;
    presetName?: string;
    linkedTaskId?: string;
    linkedTaskTitle?: string;
}

export class StartFocusSession implements UseCase<StartFocusSessionRequest, Result<FocusSession>> {
    constructor(private readonly repository: IFocusRepository) { }

    async execute(request: StartFocusSessionRequest): Promise<Result<FocusSession>> {
        const session = FocusSession.create({
            mode: request.mode,
            presetId: request.presetId,
            presetName: request.presetName,
            linkedTaskId: request.linkedTaskId,
            linkedTaskTitle: request.linkedTaskTitle,
        });

        const saveResult = await this.repository.save(session);

        if (saveResult.isFailure) {
            return Result.fail(saveResult.error);
        }

        return Result.ok(session);
    }
}
