/**
 * Focus Preset Entity
 * Represents a saved timer preset (e.g., "Pomo 25min", "Short break")
 */
export interface FocusPresetProps {
    id: string;
    name: string;
    durationMinutes: number;
    icon: string;
    color: string;
    mode: 'pomodoro' | 'stopwatch';
    isDefault: boolean;
    sortOrder: number;
}

export class FocusPreset {
    private constructor(private props: FocusPresetProps) { }

    get id(): string { return this.props.id; }
    get name(): string { return this.props.name; }
    get durationMinutes(): number { return this.props.durationMinutes; }
    get durationSeconds(): number { return this.props.durationMinutes * 60; }
    get icon(): string { return this.props.icon; }
    get color(): string { return this.props.color; }
    get mode(): 'pomodoro' | 'stopwatch' { return this.props.mode; }
    get isDefault(): boolean { return this.props.isDefault; }
    get sortOrder(): number { return this.props.sortOrder; }

    static create(params: Omit<FocusPresetProps, 'id'>): FocusPreset {
        return new FocusPreset({
            id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...params,
        });
    }

    static fromProps(props: FocusPresetProps): FocusPreset {
        return new FocusPreset(props);
    }

    toProps(): FocusPresetProps {
        return { ...this.props };
    }
}

// Default presets
export const DEFAULT_PRESETS: FocusPresetProps[] = [
    { id: 'pomo-25', name: 'Pomo', icon: '🍅', durationMinutes: 25, color: '#ef4444', mode: 'pomodoro', isDefault: true, sortOrder: 0 },
    { id: 'short-break', name: 'Short Break', icon: '☕', durationMinutes: 5, color: '#22c55e', mode: 'pomodoro', isDefault: false, sortOrder: 1 },
    { id: 'long-break', name: 'Long Break', icon: '🌴', durationMinutes: 15, color: '#3b82f6', mode: 'pomodoro', isDefault: false, sortOrder: 2 },
    { id: 'study', name: 'Focus', icon: '📚', durationMinutes: 45, color: '#f59e0b', mode: 'pomodoro', isDefault: false, sortOrder: 3 },
    { id: 'exercise', name: 'Exercise', icon: '🏃', durationMinutes: 30, color: '#8b5cf6', mode: 'pomodoro', isDefault: false, sortOrder: 4 },
];

export const PRESET_ICONS = [
    '😊', '🅰️', '✅', '🥤', '🍳', '🍨', '🍌', '🍓', '🍊',
    '😴', '🧘', '💆', '🍲', '🚴', '🏊', '🌸',
    '💤', '🧠', '🎮', '📼', '☕', '🦷', '⚙️', '🌹',
    '🍎', '📷', '🌐', '🦈', '💼', '🛒',
    '🌱', '📺', '🐙', '👶', '🎲', '🍺',
];
