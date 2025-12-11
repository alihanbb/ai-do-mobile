// src/features/pomo/domain/entities/FocusSession.ts
// Focus session entity for Pomodoro timer

import { BaseEntity } from '../../../../core/domain/entities/BaseEntity';
import { UniqueId } from '../../../../core/domain/value-objects/UniqueId';

export type TimerMode = 'pomo' | 'stopwatch';
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusSessionProps {
    id: string;
    mode: TimerMode;
    duration: number; // in seconds
    startedAt: Date;
    endedAt?: Date;
    pausedDuration: number; // total paused time in seconds
    completed: boolean;
    presetId?: string;
    presetName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimerPreset {
    id: string;
    name: string;
    duration: number; // in minutes
    icon: string;
    color: string;
    mode?: TimerMode;
    isDefault?: boolean;
}

export interface FocusStats {
    totalSessions: number;
    totalFocusTime: number; // in minutes
    todaySessions: number;
    todayFocusTime: number;
    averageSessionLength: number;
    longestSession: number;
    currentStreak: number;
    // Legacy fields for backward compatibility
    todayPomoCount?: number;
    todayFocusDuration?: number;
    totalPomoCount?: number;
    totalFocusDuration?: number;
    weeklyData?: DayStats[];
}

export interface DayStats {
    date: string; // YYYY-MM-DD
    pomoCount: number;
    focusDuration: number; // in minutes
}

// Default presets
export const defaultPresets: TimerPreset[] = [
    { id: 'pomo-25', name: 'Pomo', icon: '🍅', duration: 25, color: '#ef4444', mode: 'pomo', isDefault: true },
    { id: 'short-break', name: 'Kısa Mola', icon: '☕', duration: 5, color: '#22c55e', mode: 'pomo' },
    { id: 'long-break', name: 'Uzun Mola', icon: '🌴', duration: 15, color: '#3b82f6', mode: 'pomo' },
    { id: 'study', name: 'Çalışma', icon: '📚', duration: 45, color: '#f59e0b', mode: 'pomo' },
    { id: 'exercise', name: 'Egzersiz', icon: '🏃', duration: 30, color: '#8b5cf6', mode: 'pomo' },
];

// Available icons for presets
export const presetIcons = [
    '😊', '🅰️', '✅', '🥤', '🍳', '🍨', '🍌', '🍓', '🍊',
    '😴', '🧘', '💆', '🍲', '🚴', '🏊', '🌸',
    '💤', '🧠', '🎮', '📼', '☕', '🦷', '⚙️', '🌹',
    '🍎', '📷', '🌐', '🦈', '💼', '🛒',
    '🌱', '📺', '🐙', '👶', '🎲', '🍺',
];

export class FocusSession extends BaseEntity<FocusSessionProps> {
    private _mode: TimerMode;
    private _duration: number;
    private _startedAt: Date;
    private _endedAt?: Date;
    private _pausedDuration: number;
    private _completed: boolean;
    private _presetId?: string;
    private _presetName?: string;

    private constructor(props: FocusSessionProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._mode = props.mode;
        this._duration = props.duration;
        this._startedAt = props.startedAt;
        this._endedAt = props.endedAt;
        this._pausedDuration = props.pausedDuration;
        this._completed = props.completed;
        this._presetId = props.presetId;
        this._presetName = props.presetName;
    }

    // Factory methods
    static start(mode: TimerMode, preset?: TimerPreset): FocusSession {
        return new FocusSession({
            id: new UniqueId().value,
            mode,
            duration: 0,
            startedAt: new Date(),
            pausedDuration: 0,
            completed: false,
            presetId: preset?.id,
            presetName: preset?.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromJSON(props: FocusSessionProps): FocusSession {
        return new FocusSession({
            ...props,
            startedAt: new Date(props.startedAt),
            endedAt: props.endedAt ? new Date(props.endedAt) : undefined,
            createdAt: new Date(props.createdAt),
            updatedAt: new Date(props.updatedAt),
        });
    }

    // Getters
    get mode(): TimerMode { return this._mode; }
    get duration(): number { return this._duration; }
    get startedAt(): Date { return this._startedAt; }
    get endedAt(): Date | undefined { return this._endedAt; }
    get pausedDuration(): number { return this._pausedDuration; }
    get completed(): boolean { return this._completed; }
    get presetId(): string | undefined { return this._presetId; }
    get presetName(): string | undefined { return this._presetName; }

    // Computed properties
    get effectiveDuration(): number {
        return this._duration - this._pausedDuration;
    }

    get durationInMinutes(): number {
        return Math.floor(this.effectiveDuration / 60);
    }

    // Business logic
    addDuration(seconds: number): void {
        this._duration += seconds;
        this.touch();
    }

    addPausedDuration(seconds: number): void {
        this._pausedDuration += seconds;
        this.touch();
    }

    complete(): void {
        this._completed = true;
        this._endedAt = new Date();
        this.touch();
    }

    toJSON(): FocusSessionProps {
        return {
            id: this._id,
            mode: this._mode,
            duration: this._duration,
            startedAt: this._startedAt,
            endedAt: this._endedAt,
            pausedDuration: this._pausedDuration,
            completed: this._completed,
            presetId: this._presetId,
            presetName: this._presetName,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
