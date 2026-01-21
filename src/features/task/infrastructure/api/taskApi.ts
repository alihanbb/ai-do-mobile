import { apiClient, parseApiError, ApiError } from '../../../../core/infrastructure/api/apiClient';
import { TaskCategory, TaskPriority, TaskStatus } from '../../domain/entities/Task';

export interface TaskApiResult<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    dueDate?: string;
    dueTime?: string;
    allDay?: boolean;
    category?: TaskCategory;
    priority: TaskPriority;
    estimatedDuration?: number;
    reminder?: string;
    tags?: string[];
    subtasks?: { title: string }[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    startDate?: string;
    startTime?: string;
    dueDate?: string;
    dueTime?: string;
    allDay?: boolean;
    category?: TaskCategory;
    priority?: TaskPriority;
    estimatedDuration?: number;
    reminder?: string;
    tags?: string[];
}

export interface SubtaskDto {
    id: string;
    title: string;
    isCompleted: boolean;
    sortOrder: number;
}

export interface TaskDto {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    isCompleted: boolean;
    completedAt?: string;
    startDate?: string;
    startTime?: string;
    dueDate?: string;
    dueTime?: string;
    allDay: boolean;
    category: TaskCategory;
    priority: TaskPriority;
    estimatedDuration?: number;
    reminder?: string;
    tags: string[];
    subtasks: SubtaskDto[];
    aiSuggested: boolean;
    aiParsedFrom?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GetTasksParams {
    status?: string;
    isCompleted?: boolean;
    category?: string;
    priority?: string;
    startDateFrom?: string;
    startDateTo?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    search?: string;
    tags?: string;
    page?: number;
    pageSize?: number;
}

class TaskApi {
    private readonly basePath = 'tasks';

    // ============ CRUD Operations ============

    async getTasks(params?: GetTasksParams): Promise<TaskApiResult<PaginatedResult<TaskDto>>> {
        try {
            const response = await apiClient.get<PaginatedResult<TaskDto>>(this.basePath, { params });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async getTaskById(id: string): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.get<TaskDto>(`${this.basePath}/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async createTask(request: CreateTaskRequest): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.post<TaskDto>(this.basePath, request);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async updateTask(id: string, updates: UpdateTaskRequest): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.put<TaskDto>(`${this.basePath}/${id}`, updates);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async deleteTask(id: string): Promise<TaskApiResult<void>> {
        try {
            await apiClient.delete(`${this.basePath}/${id}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Status Operations ============

    async completeTask(id: string): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.put<TaskDto>(`${this.basePath}/${id}/complete`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async uncompleteTask(id: string): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.put<TaskDto>(`${this.basePath}/${id}/uncomplete`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Query Operations ============

    async getTodayTasks(): Promise<TaskApiResult<PaginatedResult<TaskDto>>> {
        try {
            const response = await apiClient.get<PaginatedResult<TaskDto>>(`${this.basePath}/today`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async getOverdueTasks(): Promise<TaskApiResult<PaginatedResult<TaskDto>>> {
        try {
            const response = await apiClient.get<PaginatedResult<TaskDto>>(`${this.basePath}/overdue`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    // ============ Subtask Operations ============

    async addSubtask(taskId: string, title: string): Promise<TaskApiResult<SubtaskDto>> {
        try {
            const response = await apiClient.post<SubtaskDto>(`${this.basePath}/${taskId}/subtasks`, { title });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async completeSubtask(taskId: string, subtaskId: string): Promise<TaskApiResult<TaskDto>> {
        try {
            const response = await apiClient.put<TaskDto>(`${this.basePath}/${taskId}/subtasks/${subtaskId}/complete`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }

    async deleteSubtask(taskId: string, subtaskId: string): Promise<TaskApiResult<void>> {
        try {
            await apiClient.delete(`${this.basePath}/${taskId}/subtasks/${subtaskId}`);
            return { success: true };
        } catch (error) {
            return { success: false, error: parseApiError(error) };
        }
    }
}

export const taskApi = new TaskApi();
