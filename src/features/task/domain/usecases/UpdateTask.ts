// src/features/task/domain/usecases/UpdateTask.ts
// Use case for updating an existing task

import { Task, TaskCategory, TaskPriority } from '../entities/Task';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export interface UpdateTaskDTO {
    id: string;
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: Date | null;
    dueTime?: string;
    category?: TaskCategory | null;
    priority?: TaskPriority;
    estimatedDuration?: number;
}

export class UpdateTaskUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(dto: UpdateTaskDTO): Promise<Result<Task, Error>> {
        try {
            // Get existing task
            const getResult = await this.taskRepository.getById(dto.id);
            if (getResult.isFailure) {
                return Result.fail(getResult.error);
            }

            const task = getResult.value;
            if (!task) {
                return Result.fail(new Error('Task not found'));
            }

            // Apply updates
            if (dto.title !== undefined) {
                task.updateTitle(dto.title);
            }
            if (dto.description !== undefined) {
                task.updateDescription(dto.description || undefined);
            }
            if (dto.completed !== undefined) {
                dto.completed ? task.complete() : task.uncomplete();
            }
            if (dto.dueDate !== undefined) {
                task.setDueDate(dto.dueDate || undefined, dto.dueTime);
            }
            if (dto.category !== undefined) {
                task.updateCategory(dto.category || undefined);
            }
            if (dto.priority !== undefined) {
                task.updatePriority(dto.priority);
            }

            // Save to repository
            const updateResult = await this.taskRepository.update(task);
            if (updateResult.isFailure) {
                return Result.fail(updateResult.error);
            }

            return Result.ok(task);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
