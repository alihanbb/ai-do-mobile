// types/task.ts
// Re-export from new Clean Architecture location for backward compatibility

export type {
    TaskProps as Task,
    TaskCategory,
    TaskPriority,
    Subtask,
    AISuggestion,
    TaskFilter,
} from '../src/features/task/domain/entities/Task';

export {
    categoryIcons,
    categoryColors,
    priorityColors,
} from '../src/features/task/domain/entities/Task';
