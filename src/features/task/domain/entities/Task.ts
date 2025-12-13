import { BaseEntity } from '../../../../core/domain/entities/BaseEntity';
import { UniqueId } from '../../../../core/domain/value-objects/UniqueId';

export type TaskCategory =
    | 'work'
    | 'personal'
    | 'health'
    | 'education'
    | 'shopping'
    | 'finance'
    | 'social'
    | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskProps {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
    dueTime?: string;
    category?: TaskCategory;
    priority: TaskPriority;
    estimatedDuration?: number;
    reminder?: Date;
    tags?: string[];
    subtasks?: Subtask[];
    createdAt: Date;
    updatedAt: Date;
    aiSuggested?: boolean;
    aiParsedFrom?: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export class Task extends BaseEntity<TaskProps> {
    private _title: string;
    private _description?: string;
    private _completed: boolean;
    private _dueDate?: Date;
    private _dueTime?: string;
    private _category?: TaskCategory;
    private _priority: TaskPriority;
    private _estimatedDuration?: number;
    private _reminder?: Date;
    private _tags: string[];
    private _subtasks: Subtask[];
    private _aiSuggested: boolean;
    private _aiParsedFrom?: string;

    private constructor(props: TaskProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._title = props.title;
        this._description = props.description;
        this._completed = props.completed;
        this._dueDate = props.dueDate;
        this._dueTime = props.dueTime;
        this._category = props.category;
        this._priority = props.priority;
        this._estimatedDuration = props.estimatedDuration;
        this._reminder = props.reminder;
        this._tags = props.tags || [];
        this._subtasks = props.subtasks || [];
        this._aiSuggested = props.aiSuggested || false;
        this._aiParsedFrom = props.aiParsedFrom;
    }

    // Factory methods
    static create(props: Omit<TaskProps, 'id' | 'createdAt' | 'updatedAt' | 'completed'>): Task {
        return new Task({
            ...props,
            id: new UniqueId().value,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromJSON(props: TaskProps): Task {
        return new Task({
            ...props,
            dueDate: props.dueDate ? new Date(props.dueDate) : undefined,
            reminder: props.reminder ? new Date(props.reminder) : undefined,
            createdAt: new Date(props.createdAt),
            updatedAt: new Date(props.updatedAt),
        });
    }

    // Getters
    get title(): string { return this._title; }
    get description(): string | undefined { return this._description; }
    get completed(): boolean { return this._completed; }
    get dueDate(): Date | undefined { return this._dueDate; }
    get dueTime(): string | undefined { return this._dueTime; }
    get category(): TaskCategory | undefined { return this._category; }
    get priority(): TaskPriority { return this._priority; }
    get estimatedDuration(): number | undefined { return this._estimatedDuration; }
    get reminder(): Date | undefined { return this._reminder; }
    get tags(): string[] { return [...this._tags]; }
    get subtasks(): Subtask[] { return [...this._subtasks]; }
    get aiSuggested(): boolean { return this._aiSuggested; }
    get aiParsedFrom(): string | undefined { return this._aiParsedFrom; }

    // Business logic methods
    complete(): void {
        this._completed = true;
        this.touch();
    }

    uncomplete(): void {
        this._completed = false;
        this.touch();
    }

    toggleComplete(): void {
        this._completed = !this._completed;
        this.touch();
    }

    updateTitle(title: string): void {
        if (!title.trim()) {
            throw new Error('Title cannot be empty');
        }
        this._title = title.trim();
        this.touch();
    }

    updateDescription(description: string | undefined): void {
        this._description = description?.trim();
        this.touch();
    }

    updatePriority(priority: TaskPriority): void {
        this._priority = priority;
        this.touch();
    }

    updateCategory(category: TaskCategory | undefined): void {
        this._category = category;
        this.touch();
    }

    setDueDate(date: Date | undefined, time?: string): void {
        this._dueDate = date;
        this._dueTime = time;
        this.touch();
    }

    addSubtask(title: string): Subtask {
        const subtask: Subtask = {
            id: new UniqueId().value,
            title: title.trim(),
            completed: false,
        };
        this._subtasks.push(subtask);
        this.touch();
        return subtask;
    }

    toggleSubtask(subtaskId: string): void {
        const subtask = this._subtasks.find(s => s.id === subtaskId);
        if (subtask) {
            subtask.completed = !subtask.completed;
            this.touch();
        }
    }

    removeSubtask(subtaskId: string): void {
        this._subtasks = this._subtasks.filter(s => s.id !== subtaskId);
        this.touch();
    }

    addTag(tag: string): void {
        const normalizedTag = tag.trim().toLowerCase();
        if (!this._tags.includes(normalizedTag)) {
            this._tags.push(normalizedTag);
            this.touch();
        }
    }

    removeTag(tag: string): void {
        this._tags = this._tags.filter(t => t !== tag.toLowerCase());
        this.touch();
    }

    // Computed properties
    get isOverdue(): boolean {
        if (!this._dueDate || this._completed) return false;
        return new Date() > this._dueDate;
    }

    get isDueToday(): boolean {
        if (!this._dueDate) return false;
        const today = new Date();
        return (
            this._dueDate.getFullYear() === today.getFullYear() &&
            this._dueDate.getMonth() === today.getMonth() &&
            this._dueDate.getDate() === today.getDate()
        );
    }

    get completionPercentage(): number {
        if (this._subtasks.length === 0) return this._completed ? 100 : 0;
        const completedCount = this._subtasks.filter(s => s.completed).length;
        return Math.round((completedCount / this._subtasks.length) * 100);
    }

    toJSON(): TaskProps {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            completed: this._completed,
            dueDate: this._dueDate,
            dueTime: this._dueTime,
            category: this._category,
            priority: this._priority,
            estimatedDuration: this._estimatedDuration,
            reminder: this._reminder,
            tags: [...this._tags],
            subtasks: [...this._subtasks],
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            aiSuggested: this._aiSuggested,
            aiParsedFrom: this._aiParsedFrom,
        };
    }
}

// Category icons mapping
export const categoryIcons: Record<TaskCategory, string> = {
    work: 'briefcase',
    personal: 'user',
    health: 'heart',
    education: 'book-open',
    shopping: 'shopping-cart',
    finance: 'wallet',
    social: 'users',
    other: 'folder',
};

// Category colors mapping
export const categoryColors: Record<TaskCategory, string> = {
    work: '#3b82f6',
    personal: '#8b5cf6',
    health: '#22c55e',
    education: '#f59e0b',
    shopping: '#ec4899',
    finance: '#14b8a6',
    social: '#f97316',
    other: '#6b7280',
};

// Priority colors mapping
export const priorityColors: Record<TaskPriority, string> = {
    low: '#6b7280',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
};

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

