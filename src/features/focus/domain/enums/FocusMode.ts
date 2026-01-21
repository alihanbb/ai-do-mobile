/**
 * Focus Mode Enum
 * Represents the type of focus session
 */
export enum FocusMode {
    /** Pomodoro technique - fixed duration countdown */
    Pomodoro = 'pomodoro',
    /** Stopwatch mode - count up with no limit */
    Stopwatch = 'stopwatch',
}

export const FocusModeLabels: Record<FocusMode, string> = {
    [FocusMode.Pomodoro]: 'Pomodoro',
    [FocusMode.Stopwatch]: 'Kronometre',
};

export const FocusModeDescriptions: Record<FocusMode, string> = {
    [FocusMode.Pomodoro]: 'Belirlenen süre dolduğunda biten odaklanma seansı',
    [FocusMode.Stopwatch]: 'Süre sınırı olmadan devam eden kronometre modu',
};
