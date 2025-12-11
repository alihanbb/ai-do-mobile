// src/features/task/domain/usecases/GetTasks.ts
// Use cases for retrieving tasks

import { Task } from '../entities/Task';
import { ITaskRepository, TaskFilter } from '../repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export class GetAllTasksUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(): Promise<Result<Task[], Error>> {
        return this.taskRepository.getAll();
    }
}

export class GetTaskByIdUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(id: string): Promise<Result<Task | null, Error>> {
        return this.taskRepository.getById(id);
    }
}

export class GetTodayTasksUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(): Promise<Result<Task[], Error>> {
        return this.taskRepository.getTodayTasks();
    }
}

export class GetPendingTasksUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(): Promise<Result<Task[], Error>> {
        return this.taskRepository.getPendingTasks();
    }
}

export class GetCompletedTasksUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(): Promise<Result<Task[], Error>> {
        return this.taskRepository.getCompletedTasks();
    }
}

export class GetFilteredTasksUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(filter: TaskFilter): Promise<Result<Task[], Error>> {
        return this.taskRepository.getByFilter(filter);
    }
}

export class ToggleTaskCompleteUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(id: string): Promise<Result<Task, Error>> {
        try {
            const getResult = await this.taskRepository.getById(id);
            if (getResult.isFailure) {
                return Result.fail(getResult.error);
            }

            const task = getResult.value;
            if (!task) {
                return Result.fail(new Error('Task not found'));
            }

            task.toggleComplete();

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
