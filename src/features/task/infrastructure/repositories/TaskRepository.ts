import { Task, TaskProps } from '../../domain/entities/Task';
import { ITaskRepository, TaskFilter } from '../../domain/repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';
import { taskApi, TaskDto, CreateTaskRequest } from '../api/taskApi';

export class TaskRepository implements ITaskRepository {
    private mapDtoToTask(dto: TaskDto): Task {
        return Task.fromJSON({
            id: dto.id,
            title: dto.title,
            description: dto.description,
            status: dto.status,
            completed: dto.isCompleted,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            dueTime: dto.dueTime,
            category: dto.category,
            priority: dto.priority,
            estimatedDuration: dto.estimatedDuration,
            reminder: dto.reminder ? new Date(dto.reminder) : undefined,
            subtasks: dto.subtasks?.map(s => ({
                id: s.id,
                title: s.title,
                completed: s.isCompleted,
            })) || [],
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
        });
    }

    async getAll(): Promise<Result<Task[], Error>> {
        try {
            console.log('📡 TaskRepository.getAll: Calling API to fetch tasks');
            const result = await taskApi.getTasks({ page: 1, pageSize: 100 });

            console.log('📥 TaskRepository.getAll: API response received', {
                success: result.success,
                itemCount: result.data?.items?.length || 0,
                totalCount: result.data?.totalCount,
                error: result.error?.message
            });

            if (result.success && result.data) {
                console.log('🔄 TaskRepository.getAll: Mapping DTOs to Task entities');
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));

                console.log(`✅ TaskRepository.getAll: Successfully mapped ${tasks.length} tasks`);
                console.log('📋 TaskRepository.getAll: Task titles:', tasks.map(t => t.title));

                // Sort by createdAt descending (newest first)
                tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                console.log('✅ TaskRepository.getAll: Tasks sorted by creation date');

                return Result.ok(tasks);
            }

            console.error('❌ TaskRepository.getAll: API call failed:', result.error?.message);
            return Result.fail(new Error(result.error?.message || 'Failed to fetch tasks'));
        } catch (error) {
            console.error('💥 TaskRepository.getAll: Exception thrown:', error);
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getById(id: string): Promise<Result<Task | null, Error>> {
        try {
            const result = await taskApi.getTaskById(id);

            if (result.success && result.data) {
                return Result.ok(this.mapDtoToTask(result.data));
            }

            if (result.error?.status === 404) {
                return Result.ok(null);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch task'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async save(task: Task): Promise<Result<void, Error>> {
        console.log('📦 TaskRepository.save called with task:', task.title);
        try {
            console.log('🛠 Preparing CreateTaskRequest...');
            const formatDateOnly = (date?: Date): string | undefined => {
                try {
                    if (!date) return undefined;
                    return date.toISOString().split('T')[0];
                } catch (e) {
                    console.error('❌ Date formatting error:', e, date);
                    return undefined;
                }
            };

            const request: CreateTaskRequest = {
                title: task.title,
                description: task.description,
                dueDate: formatDateOnly(task.dueDate),
                dueTime: task.dueTime,
                category: task.category,
                priority: task.priority,
                estimatedDuration: task.estimatedDuration,
                reminder: task.reminder?.toISOString(),
            };
            console.log('📤 Calling taskApi.createTask with:', JSON.stringify(request));

            const result = await taskApi.createTask(request);
            console.log('📥 taskApi.createTask full result:', JSON.stringify(result));

            if (result.success) {
                console.log('✨ Task creation SUCCESSFUL according to API!');
                return Result.ok(undefined);
            }

            console.log('❌ Task creation failed:', result.error);
            return Result.fail(new Error(result.error?.message || 'Failed to create task'));
        } catch (error) {
            console.error('💥 TaskRepository.save error:', error);
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async update(task: Task): Promise<Result<void, Error>> {
        try {
            const result = await taskApi.updateTask(task.id, {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined,
                dueTime: task.dueTime,
                category: task.category,
                priority: task.priority,
                estimatedDuration: task.estimatedDuration,
                reminder: task.reminder?.toISOString(),
            });

            if (result.success) {
                return Result.ok(undefined);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to update task'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async delete(id: string): Promise<Result<void, Error>> {
        try {
            const result = await taskApi.deleteTask(id);

            if (result.success) {
                return Result.ok(undefined);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to delete task'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async toggleComplete(id: string, currentlyCompleted: boolean): Promise<Result<Task, Error>> {
        try {
            const result = currentlyCompleted
                ? await taskApi.uncompleteTask(id)
                : await taskApi.completeTask(id);

            if (result.success && result.data) {
                return Result.ok(this.mapDtoToTask(result.data));
            }

            return Result.fail(new Error(result.error?.message || 'Failed to toggle task'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getByFilter(filter: TaskFilter): Promise<Result<Task[], Error>> {
        try {
            const result = await taskApi.getTasks({
                isCompleted: filter.completed,
                category: filter.category,
                priority: filter.priority,
                search: filter.search,
                dueDateFrom: filter.dateRange?.start.toISOString().split('T')[0],
                dueDateTo: filter.dateRange?.end.toISOString().split('T')[0],
                page: 1,
                pageSize: 100,
            });

            if (result.success && result.data) {
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));
                return Result.ok(tasks);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch tasks'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getTodayTasks(): Promise<Result<Task[], Error>> {
        try {
            const result = await taskApi.getTodayTasks();

            if (result.success && result.data) {
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));
                return Result.ok(tasks);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch today tasks'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getCompletedTasks(): Promise<Result<Task[], Error>> {
        try {
            const result = await taskApi.getTasks({ isCompleted: true, page: 1, pageSize: 100 });

            if (result.success && result.data) {
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));
                return Result.ok(tasks);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch completed tasks'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getPendingTasks(): Promise<Result<Task[], Error>> {
        try {
            const result = await taskApi.getTasks({ isCompleted: false, page: 1, pageSize: 100 });

            if (result.success && result.data) {
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));
                return Result.ok(tasks);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch pending tasks'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    async getOverdueTasks(): Promise<Result<Task[], Error>> {
        try {
            const result = await taskApi.getOverdueTasks();

            if (result.success && result.data) {
                const tasks = result.data.items.map(dto => this.mapDtoToTask(dto));
                return Result.ok(tasks);
            }

            return Result.fail(new Error(result.error?.message || 'Failed to fetch overdue tasks'));
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}

// Singleton instance - no storage dependency needed
export const taskRepository = new TaskRepository();
