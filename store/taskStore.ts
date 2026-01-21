// store/taskStore.ts
// Re-export from new Clean Architecture location
// This file maintains backward compatibility with existing imports

import { useTaskStore as useCleanTaskStore } from '../src/features/task/presentation/stores/useTaskStore';
import { TaskProps } from '../src/features/task/domain/entities/Task';

// Re-export Task types for convenience
export type {
    TaskProps as Task,
    TaskCategory,
    TaskPriority,
    Subtask,
} from '../src/features/task/domain/entities/Task';

// Re-export TaskFilter from repository
export type { TaskFilter } from '../src/features/task/domain/repositories/ITaskRepository';

// Re-export AISuggestion
export type { AISuggestion } from '../src/features/task/presentation/stores/useTaskStore';

// Create a wrapper hook that adds backward compatibility for addTask
export const useTaskStore = () => {
    const store = useCleanTaskStore();

    // Wrapper for backward compatibility - old code uses addTask(task) 
    // New code uses createTask(data) which returns Promise<boolean>
    const addTask = async (task: TaskProps) => {
        console.log('🚀 addTask called with:', JSON.stringify(task, null, 2));
        try {
            const result = await store.createTask({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                dueTime: task.dueTime,
                category: task.category,
                priority: task.priority,
                estimatedDuration: task.estimatedDuration,
            });
            console.log('✅ createTask result:', result);
            return result;
        } catch (error) {
            console.error('❌ addTask error:', error);
            throw error;
        }
    };

    return {
        ...store,
        addTask, // backward compatible addTask
    };
};

