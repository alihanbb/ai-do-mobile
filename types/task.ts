// types/task.ts
// Re-export from new Clean Architecture location for backward compatibility

export type {
    TaskProps as Task,
    TaskCategory,
    TaskPriority,
    TaskStatus,
    Subtask,
    AISuggestion,
} from '../src/features/task/domain/entities/Task';

export type { TaskFilter } from '../src/features/task/domain/repositories/ITaskRepository';

export {
    categoryIcons,
    categoryColors,
    priorityColors,
} from '../src/features/task/domain/entities/Task';
