// src/features/task/presentation/stores/useTaskStore.ts
// Task store integrated with Clean Architecture

import { create } from 'zustand';
import { Task, TaskProps, TaskCategory, TaskPriority } from '../../domain/entities/Task';
import { TaskRepository } from '../../infrastructure/repositories/TaskRepository';
import { asyncStorage } from '../../../../core/infrastructure/storage';
import {
    CreateTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetAllTasksUseCase,
    ToggleTaskCompleteUseCase,
} from '../../domain/usecases';

// Create repository and use cases
const taskRepository = new TaskRepository(asyncStorage);
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const toggleCompleteUseCase = new ToggleTaskCompleteUseCase(taskRepository);

// AI Suggestion type
export interface AISuggestion {
    id: string;
    type: 'task_time' | 'break' | 'reminder' | 'energy';
    title: string;
    message: string;
    taskId?: string;
    suggestedTime?: Date;
    dismissed: boolean;
}

// Store state interface
interface TaskState {
    tasks: TaskProps[];
    suggestions: AISuggestion[];
    isLoading: boolean;
    error: string | null;
    initialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    createTask: (data: {
        title: string;
        description?: string;
        dueDate?: Date;
        dueTime?: string;
        category?: TaskCategory;
        priority: TaskPriority;
        estimatedDuration?: number;
    }) => Promise<boolean>;
    updateTask: (id: string, updates: Partial<TaskProps>) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
    toggleComplete: (id: string) => Promise<boolean>;
    dismissSuggestion: (id: string) => void;

    // Selectors
    getTodayTasks: () => TaskProps[];
    getCompletedTasks: () => TaskProps[];
    getPendingTasks: () => TaskProps[];
}

// Mock suggestions for AI features
const mockSuggestions: AISuggestion[] = [
    {
        id: '1',
        type: 'energy',
        title: 'Yüksek Enerji Saati',
        message: 'Şu an enerjin yüksek! Zor görevler için ideal zaman.',
        dismissed: false,
    },
];

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    suggestions: mockSuggestions,
    isLoading: false,
    error: null,
    initialized: false,

    initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true, error: null });

        const result = await getAllTasksUseCase.execute();

        if (result.isSuccess) {
            const taskProps = result.value.map(task => task.toJSON());
            set({ tasks: taskProps, initialized: true, isLoading: false });
        } else {
            set({ error: result.error.message, isLoading: false, initialized: true });
        }
    },

    createTask: async (data) => {
        set({ isLoading: true, error: null });

        const result = await createTaskUseCase.execute(data);

        if (result.isSuccess) {
            const newTask = result.value.toJSON();
            set((state) => ({
                tasks: [newTask, ...state.tasks],
                isLoading: false,
            }));
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    updateTask: async (id, updates) => {
        set({ isLoading: true, error: null });

        const result = await updateTaskUseCase.execute({ id, ...updates });

        if (result.isSuccess) {
            const updatedTask = result.value.toJSON();
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                isLoading: false,
            }));
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true, error: null });

        const result = await deleteTaskUseCase.execute(id);

        if (result.isSuccess) {
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                isLoading: false,
            }));
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    toggleComplete: async (id) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
            ),
        }));

        const result = await toggleCompleteUseCase.execute(id);

        if (result.isFailure) {
            // Rollback on failure
            set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ),
                error: result.error.message,
            }));
            return false;
        }

        return true;
    },

    dismissSuggestion: (id) => {
        set((state) => ({
            suggestions: state.suggestions.map((s) =>
                s.id === id ? { ...s, dismissed: true } : s
            ),
        }));
    },

    getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return get().tasks.filter((task) => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate < tomorrow;
        });
    },

    getCompletedTasks: () => get().tasks.filter((t) => t.completed),

    getPendingTasks: () => get().tasks.filter((t) => !t.completed),
}));
