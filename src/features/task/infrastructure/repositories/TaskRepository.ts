// src/features/task/infrastructure/repositories/TaskRepository.ts
// Task repository implementation with in-memory storage and async persistence

import { Task, TaskProps } from '../../domain/entities/Task';
import { ITaskRepository, TaskFilter } from '../../domain/repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';
import { IStorageAdapter } from '../../../../core/infrastructure/storage/IStorageAdapter';

const TASKS_STORAGE_KEY = 'tasks';

export class TaskRepository implements ITaskRepository {
    private tasks: Map<string, Task> = new Map();
    private initialized = false;

    constructor(private readonly storage: IStorageAdapter) { }

    private async ensureInitialized(): Promise<void> {
        if (this.initialized) return;

        try {
            const storedTasks = await this.storage.get<TaskProps[]>(TASKS_STORAGE_KEY);
            if (storedTasks) {
                storedTasks.forEach(props => {
                    const task = Task.fromJSON(props);
                    this.tasks.set(task.id, task);
                });
            }
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize TaskRepository:', error);
            this.initialized = true; // Continue with empty state
        }
    }

    private async persist(): Promise<void> {
        const tasksArray = Array.from(this.tasks.values()).map(task => task.toJSON());
        await this.storage.set(TASKS_STORAGE_KEY, tasksArray);
    }

    async getAll(): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            return Result.ok(Array.from(this.tasks.values()));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getById(id: string): Promise<Result<Task | null, Error>> {
        try {
            await this.ensureInitialized();
            return Result.ok(this.tasks.get(id) || null);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async save(task: Task): Promise<Result<void, Error>> {
        try {
            await this.ensureInitialized();
            this.tasks.set(task.id, task);
            await this.persist();
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async update(task: Task): Promise<Result<void, Error>> {
        try {
            await this.ensureInitialized();
            if (!this.tasks.has(task.id)) {
                return Result.fail(new Error('Task not found'));
            }
            this.tasks.set(task.id, task);
            await this.persist();
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async delete(id: string): Promise<Result<void, Error>> {
        try {
            await this.ensureInitialized();
            if (!this.tasks.has(id)) {
                return Result.fail(new Error('Task not found'));
            }
            this.tasks.delete(id);
            await this.persist();
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getByFilter(filter: TaskFilter): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            let tasks = Array.from(this.tasks.values());

            if (filter.completed !== undefined) {
                tasks = tasks.filter(t => t.completed === filter.completed);
            }
            if (filter.category) {
                tasks = tasks.filter(t => t.category === filter.category);
            }
            if (filter.priority) {
                tasks = tasks.filter(t => t.priority === filter.priority);
            }
            if (filter.search) {
                const query = filter.search.toLowerCase();
                tasks = tasks.filter(t =>
                    t.title.toLowerCase().includes(query) ||
                    t.description?.toLowerCase().includes(query)
                );
            }
            if (filter.dateRange) {
                tasks = tasks.filter(t => {
                    if (!t.dueDate) return false;
                    return t.dueDate >= filter.dateRange!.start &&
                        t.dueDate <= filter.dateRange!.end;
                });
            }

            return Result.ok(tasks);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getTodayTasks(): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const tasks = Array.from(this.tasks.values()).filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate >= today && dueDate < tomorrow;
            });

            return Result.ok(tasks);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getCompletedTasks(): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            const tasks = Array.from(this.tasks.values()).filter(t => t.completed);
            return Result.ok(tasks);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getPendingTasks(): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            const tasks = Array.from(this.tasks.values()).filter(t => !t.completed);
            return Result.ok(tasks);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getOverdueTasks(): Promise<Result<Task[], Error>> {
        try {
            await this.ensureInitialized();
            const now = new Date();
            const tasks = Array.from(this.tasks.values()).filter(t => {
                if (!t.dueDate || t.completed) return false;
                return t.dueDate < now;
            });
            return Result.ok(tasks);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
