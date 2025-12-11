// src/features/task/domain/repositories/ITaskRepository.ts
// Task repository interface following repository pattern

import { Task, TaskProps } from '../entities/Task';
import { Result } from '../../../../core/domain/value-objects/Result';

export interface TaskFilter {
    completed?: boolean;
    category?: string;
    priority?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
    search?: string;
}

export interface ITaskRepository {
    // CRUD operations
    getAll(): Promise<Result<Task[], Error>>;
    getById(id: string): Promise<Result<Task | null, Error>>;
    save(task: Task): Promise<Result<void, Error>>;
    update(task: Task): Promise<Result<void, Error>>;
    delete(id: string): Promise<Result<void, Error>>;

    // Query operations
    getByFilter(filter: TaskFilter): Promise<Result<Task[], Error>>;
    getTodayTasks(): Promise<Result<Task[], Error>>;
    getCompletedTasks(): Promise<Result<Task[], Error>>;
    getPendingTasks(): Promise<Result<Task[], Error>>;
    getOverdueTasks(): Promise<Result<Task[], Error>>;
}
