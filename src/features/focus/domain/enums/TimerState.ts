/**
 * Timer State Enum
 * Represents the current state of the timer
 */
export enum TimerState {
    /** Timer is not started */
    Idle = 'idle',
    /** Timer is actively running */
    Running = 'running',
    /** Timer is paused */
    Paused = 'paused',
    /** Timer has completed */
    Completed = 'completed',
}

export const TimerStateLabels: Record<TimerState, string> = {
    [TimerState.Idle]: 'Bekleniyor',
    [TimerState.Running]: 'Çalışıyor',
    [TimerState.Paused]: 'Duraklatıldı',
    [TimerState.Completed]: 'Tamamlandı',
};

export function isActiveState(state: TimerState): boolean {
    return state === TimerState.Running || state === TimerState.Paused;
}

export function canStart(state: TimerState): boolean {
    return state === TimerState.Idle || state === TimerState.Completed;
}

export function canPause(state: TimerState): boolean {
    return state === TimerState.Running;
}

export function canResume(state: TimerState): boolean {
    return state === TimerState.Paused;
}

export function canStop(state: TimerState): boolean {
    return state === TimerState.Running || state === TimerState.Paused;
}
