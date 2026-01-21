/**
 * Focus Session Entity
 * Represents a single focus/pomodoro session
 */
export interface FocusSessionProps {
    id: string;
    mode: FocusMode;
    durationSeconds: number;
    pausedDurationSeconds: number;
    startedAt: Date;
    endedAt?: Date;
    isCompleted: boolean;
    presetId?: string;
    presetName?: string;
    linkedTaskId?: string;
    linkedTaskTitle?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type FocusMode = 'pomodoro' | 'stopwatch';
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export class FocusSession {
    private constructor(private props: FocusSessionProps) { }

    get id(): string { return this.props.id; }
    get mode(): FocusMode { return this.props.mode; }
    get durationSeconds(): number { return this.props.durationSeconds; }
    get pausedDurationSeconds(): number { return this.props.pausedDurationSeconds; }
    get startedAt(): Date { return this.props.startedAt; }
    get endedAt(): Date | undefined { return this.props.endedAt; }
    get isCompleted(): boolean { return this.props.isCompleted; }
    get presetId(): string | undefined { return this.props.presetId; }
    get presetName(): string | undefined { return this.props.presetName; }
    get linkedTaskId(): string | undefined { return this.props.linkedTaskId; }
    get linkedTaskTitle(): string | undefined { return this.props.linkedTaskTitle; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }

    get effectiveDurationSeconds(): number {
        return this.props.durationSeconds - this.props.pausedDurationSeconds;
    }

    get durationMinutes(): number {
        return Math.floor(this.effectiveDurationSeconds / 60);
    }

    static create(params: {
        mode: FocusMode;
        presetId?: string;
        presetName?: string;
        linkedTaskId?: string;
        linkedTaskTitle?: string;
    }): FocusSession {
        const now = new Date();
        return new FocusSession({
            id: `focus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            mode: params.mode,
            durationSeconds: 0,
            pausedDurationSeconds: 0,
            startedAt: now,
            isCompleted: false,
            presetId: params.presetId,
            presetName: params.presetName,
            linkedTaskId: params.linkedTaskId,
            linkedTaskTitle: params.linkedTaskTitle,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromProps(props: FocusSessionProps): FocusSession {
        return new FocusSession({
            ...props,
            startedAt: new Date(props.startedAt),
            endedAt: props.endedAt ? new Date(props.endedAt) : undefined,
            createdAt: new Date(props.createdAt),
            updatedAt: new Date(props.updatedAt),
        });
    }

    complete(durationSeconds: number): FocusSession {
        return new FocusSession({
            ...this.props,
            durationSeconds,
            endedAt: new Date(),
            isCompleted: true,
            updatedAt: new Date(),
        });
    }

    toProps(): FocusSessionProps {
        return { ...this.props };
    }
}
