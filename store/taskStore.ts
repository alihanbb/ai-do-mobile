// store/taskStore.ts
// Re-export from new Clean Architecture location
// This file maintains backward compatibility with existing imports

export { useTaskStore } from '../src/features/task/presentation/stores/useTaskStore';
export type { AISuggestion } from '../src/features/task/presentation/stores/useTaskStore';

// Re-export Task types for convenience
export type {
    TaskProps as Task,
    TaskCategory,
    TaskPriority,
    Subtask,
} from '../src/features/task/domain/entities/Task';

// Re-export TaskFilter from repository
export type { TaskFilter } from '../src/features/task/domain/repositories/ITaskRepository';
