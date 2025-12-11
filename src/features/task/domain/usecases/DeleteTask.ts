// src/features/task/domain/usecases/DeleteTask.ts
// Use case for deleting a task

import { ITaskRepository } from '../repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export class DeleteTaskUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(id: string): Promise<Result<void, Error>> {
        try {
            // Verify task exists
            const getResult = await this.taskRepository.getById(id);
            if (getResult.isFailure) {
                return Result.fail(getResult.error);
            }

            if (!getResult.value) {
                return Result.fail(new Error('Task not found'));
            }

            // Delete from repository
            return await this.taskRepository.delete(id);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
