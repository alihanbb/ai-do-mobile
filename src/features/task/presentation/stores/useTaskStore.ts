import { create } from 'zustand';
import { Task, TaskProps, TaskCategory, TaskPriority, TaskStatus, AISuggestion } from '../../domain/entities/Task';
import { taskRepository } from '../../infrastructure/repositories/TaskRepository';

// Re-export for convenience
export type { AISuggestion };

interface TaskState {
    tasks: TaskProps[];
    suggestions: AISuggestion[];
    isLoading: boolean;
    error: string | null;

    // Actions
    initialize: () => Promise<void>;
    refresh: () => Promise<void>;
    createTask: (data: {
        title: string;
        description?: string;
        dueDate?: Date;
        dueTime?: string;
        category?: TaskCategory;
        priority: TaskPriority;
        estimatedDuration?: number;
        reminder?: Date;
    }) => Promise<boolean>;
    updateTask: (id: string, updates: Partial<TaskProps>) => Promise<boolean>;
    deleteTask: (id: string) => Promise<boolean>;
    toggleComplete: (id: string) => Promise<boolean>;
    dismissSuggestion: (id: string) => void;
    clearTasks: () => void;

    // Getters
    getTodayTasks: () => TaskProps[];
    getCompletedTasks: () => TaskProps[];
    getPendingTasks: () => TaskProps[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    suggestions: [],
    isLoading: false,
    error: null,

    initialize: async () => {
        console.log('🔄 useTaskStore.initialize: Starting task initialization');
        set({ isLoading: true, error: null });

        console.log('📡 useTaskStore.initialize: Calling taskRepository.getAll()');
        const result = await taskRepository.getAll();

        if (result.isSuccess) {
            const taskProps = result.value.map(task => task.toJSON());
            console.log(`✅ useTaskStore.initialize: Successfully fetched ${taskProps.length} tasks`);
            console.log('📋 useTaskStore.initialize: Task IDs:', taskProps.map(t => t.id));
            set({ tasks: taskProps, isLoading: false });
        } else {
            console.error('❌ useTaskStore.initialize: Failed to fetch tasks:', result.error.message);
            set({ error: result.error.message, isLoading: false });
        }
    },

    refresh: async () => {
        console.log('🔄 useTaskStore.refresh: Starting task refresh');
        set({ isLoading: true, error: null });

        console.log('📡 useTaskStore.refresh: Calling taskRepository.getAll()');
        const result = await taskRepository.getAll();

        if (result.isSuccess) {
            const taskProps = result.value.map(task => task.toJSON());
            console.log(`✅ useTaskStore.refresh: Successfully fetched ${taskProps.length} tasks`);
            console.log('📋 useTaskStore.refresh: Task IDs:', taskProps.map(t => t.id));
            console.log('📊 useTaskStore.refresh: Updating store state with tasks');
            set({ tasks: taskProps, isLoading: false });
        } else {
            console.error('❌ useTaskStore.refresh: Failed to fetch tasks:', result.error.message);
            set({ error: result.error.message, isLoading: false });
        }
    },

    createTask: async (data) => {
        console.log('🏗️ useTaskStore.createTask hook started with data:', JSON.stringify(data));
        set({ isLoading: true, error: null });

        // Create a temporary Task entity for the API
        const task = Task.create({
            title: data.title,
            priority: data.priority,
            description: data.description,
            dueDate: data.dueDate,
            dueTime: data.dueTime,
            category: data.category,
            estimatedDuration: data.estimatedDuration,
            reminder: data.reminder,
        });

        const result = await taskRepository.save(task);

        if (result.isSuccess) {
            // Refresh to get the task from server with proper ID
            await get().refresh();
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    updateTask: async (id, updates) => {
        set({ isLoading: true, error: null });

        // Get current task
        const currentTask = get().tasks.find(t => t.id === id);
        if (!currentTask) {
            set({ error: 'Task not found', isLoading: false });
            return false;
        }

        // Create updated Task entity
        const updatedTaskData = { ...currentTask, ...updates };
        const task = Task.fromJSON(updatedTaskData);

        const result = await taskRepository.update(task);

        if (result.isSuccess) {
            // Optimistic update
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                isLoading: false,
            }));
            return true;
        } else {
            set({ error: result.error.message, isLoading: false });
            return false;
        }
    },

    deleteTask: async (id) => {
        // Optimistic update
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            isLoading: true,
        }));

        const result = await taskRepository.delete(id);

        if (result.isSuccess) {
            set({ isLoading: false });
            return true;
        } else {
            // Rollback - refresh from server
            await get().refresh();
            set({ error: result.error.message });
            return false;
        }
    },

    toggleComplete: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) {
            set({ error: 'Task not found' });
            return false;
        }

        // Optimistic update
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date() } : t
            ),
        }));

        const result = await taskRepository.toggleComplete(id, task.completed);

        if (result.isFailure) {
            // Rollback
            set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, completed: task.completed } : t
                ),
                error: result.error.message,
            }));
            return false;
        }

        // Update with server response
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? result.value.toJSON() : t
            ),
        }));

        return true;
    },

    dismissSuggestion: (id) => {
        set((state) => ({
            suggestions: state.suggestions.map((s) =>
                s.id === id ? { ...s, dismissed: true } : s
            ),
        }));
    },

    clearTasks: () => {
        set({ tasks: [], error: null });
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
