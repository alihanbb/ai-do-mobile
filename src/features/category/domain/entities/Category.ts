import { UniqueId } from '../../../../core/domain/value-objects/UniqueId';

export interface CategoryProps {
    id: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
    taskCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Varsayılan kategoriler
export const DEFAULT_CATEGORIES: CategoryProps[] = [
    { id: 'work', name: 'İş', icon: 'briefcase', color: '#3b82f6', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'personal', name: 'Kişisel', icon: 'user', color: '#8b5cf6', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'health', name: 'Sağlık', icon: 'heart', color: '#22c55e', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'education', name: 'Eğitim', icon: 'book-open', color: '#f59e0b', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'shopping', name: 'Alışveriş', icon: 'shopping-cart', color: '#ec4899', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'finance', name: 'Finans', icon: 'wallet', color: '#14b8a6', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
    { id: 'social', name: 'Sosyal', icon: 'users', color: '#f97316', isDefault: true, taskCount: 0, createdAt: new Date(), updatedAt: new Date() },
];

// Kullanılabilir ikonlar
export const AVAILABLE_ICONS = [
    'briefcase', 'user', 'heart', 'book-open', 'shopping-cart', 'wallet',
    'users', 'folder', 'home', 'star', 'music', 'camera', 'coffee',
    'gift', 'globe', 'flag', 'zap', 'target', 'trophy', 'gamepad-2',
    'plane', 'car', 'utensils', 'dumbbell', 'palette', 'code', 'lightbulb'
];

// Kullanılabilir renkler
export const AVAILABLE_COLORS = [
    '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6',
    '#f97316', '#6b7280', '#ef4444', '#06b6d4', '#84cc16', '#a855f7',
    '#10b981', '#f43f5e', '#6366f1', '#0ea5e9'
];

export class Category {
    private _props: CategoryProps;

    private constructor(props: CategoryProps) {
        this._props = props;
    }

    static create(props: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt' | 'isDefault' | 'taskCount'>): Category {
        return new Category({
            ...props,
            id: new UniqueId().value,
            isDefault: false,
            taskCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromJSON(props: CategoryProps): Category {
        return new Category({
            ...props,
            createdAt: new Date(props.createdAt),
            updatedAt: new Date(props.updatedAt),
        });
    }

    get id(): string { return this._props.id; }
    get name(): string { return this._props.name; }
    get icon(): string { return this._props.icon; }
    get color(): string { return this._props.color; }
    get isDefault(): boolean { return this._props.isDefault; }
    get taskCount(): number { return this._props.taskCount; }
    get createdAt(): Date { return this._props.createdAt; }
    get updatedAt(): Date { return this._props.updatedAt; }

    updateName(name: string): void {
        if (!name.trim()) {
            throw new Error('Category name cannot be empty');
        }
        this._props.name = name.trim();
        this._props.updatedAt = new Date();
    }

    updateIcon(icon: string): void {
        this._props.icon = icon;
        this._props.updatedAt = new Date();
    }

    updateColor(color: string): void {
        this._props.color = color;
        this._props.updatedAt = new Date();
    }

    incrementTaskCount(): void {
        this._props.taskCount++;
        this._props.updatedAt = new Date();
    }

    decrementTaskCount(): void {
        if (this._props.taskCount > 0) {
            this._props.taskCount--;
            this._props.updatedAt = new Date();
        }
    }

    toJSON(): CategoryProps {
        return { ...this._props };
    }
}
