/**
 * Focus Statistics DTOs
 * Data transfer objects for focus analytics
 */

export interface FocusStatsDTO {
    totalSessions: number;
    totalFocusMinutes: number;
    todaySessions: number;
    todayFocusMinutes: number;
    todayPomoCount: number;
    totalPomoCount: number;
    averageSessionMinutes: number;
    longestSessionMinutes: number;
    currentStreak: number;
}

export interface HourlyStatsDTO {
    hour: number;           // 0-23
    focusMinutes: number;
}

export interface TimelineEntryDTO {
    id: string;
    dayOfWeek: number;      // 0 = Monday, 6 = Sunday
    startHour: number;      // 0-24 (decimal, e.g., 14.5 = 14:30)
    endHour: number;
    durationMinutes: number;
    presetName?: string;
    color: string;
}

export interface DayStatsDTO {
    date: string;           // YYYY-MM-DD
    pomoCount: number;
    focusMinutes: number;
}
