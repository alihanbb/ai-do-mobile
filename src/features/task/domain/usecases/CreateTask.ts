import { Task, TaskCategory, TaskPriority } from '../entities/Task';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Result } from '../../../../core/domain/value-objects/Result';

export interface CreateTaskDTO {
    title: string;
    description?: string;
    dueDate?: Date;
    dueTime?: string;
    category?: TaskCategory;
    priority: TaskPriority;
    estimatedDuration?: number;
    tags?: string[];
}

export class CreateTaskUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(dto: CreateTaskDTO): Promise<Result<Task, Error>> {
        try {
            // Validation
            if (!dto.title.trim()) {
                return Result.fail(new Error('Task title is required'));
            }

            // Create task entity
            const task = Task.create({
                title: dto.title.trim(),
                description: dto.description?.trim(),
                dueDate: dto.dueDate,
                dueTime: dto.dueTime,
                category: dto.category,
                priority: dto.priority,
                estimatedDuration: dto.estimatedDuration,
                tags: dto.tags,
            });

            // Save to repository
            const saveResult = await this.taskRepository.save(task);
            if (saveResult.isFailure) {
                return Result.fail(saveResult.error);
            }

            return Result.ok(task);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Unknown error'));
        }
    }
}
