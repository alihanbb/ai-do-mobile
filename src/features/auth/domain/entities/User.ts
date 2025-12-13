import { BaseEntity } from '../../../../core/domain/entities/BaseEntity';
import { UniqueId } from '../../../../core/domain/value-objects/UniqueId';

export interface UserProps {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    preferences?: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
    workingHours?: {
        start: string;
        end: string;
    };
}

export interface UserSettings {
    notifications: boolean;
    darkMode: boolean;
    language: 'tr' | 'en';
    workingHours: {
        start: string;
        end: string;
    };
    energyTracking: boolean;
}

export interface AuthState {
    user: UserProps | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export class User extends BaseEntity<UserProps> {
    private _email: string;
    private _name: string;
    private _avatar?: string;
    private _preferences: UserPreferences;

    private constructor(props: UserProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._email = props.email;
        this._name = props.name;
        this._avatar = props.avatar;
        this._preferences = props.preferences || {
            theme: 'system',
            notifications: true,
            language: 'tr',
        };
    }
    static create(email: string, name: string): User {
        return new User({
            id: new UniqueId().value,
            email,
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromJSON(props: UserProps): User {
        return new User({
            ...props,
            createdAt: new Date(props.createdAt),
            updatedAt: new Date(props.updatedAt),
        });
    }

    get email(): string { return this._email; }
    get name(): string { return this._name; }
    get avatar(): string | undefined { return this._avatar; }
    get preferences(): UserPreferences { return { ...this._preferences }; }
    updateName(name: string): void {
        if (!name.trim()) {
            throw new Error('Name cannot be empty');
        }
        this._name = name.trim();
        this.touch();
    }

    updateEmail(email: string): void {
        if (!email.includes('@')) {
            throw new Error('Invalid email format');
        }
        this._email = email.toLowerCase();
        this.touch();
    }

    updateAvatar(avatar: string | undefined): void {
        this._avatar = avatar;
        this.touch();
    }

    updatePreferences(preferences: Partial<UserPreferences>): void {
        this._preferences = { ...this._preferences, ...preferences };
        this.touch();
    }

    get initials(): string {
        return this._name
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    toJSON(): UserProps {
        return {
            id: this._id,
            email: this._email,
            name: this._name,
            avatar: this._avatar,
            preferences: { ...this._preferences },
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
