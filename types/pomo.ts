// types/pomo.ts
// Re-export from new Clean Architecture location for backward compatibility

export type {
    TimerMode,
    TimerState,
    FocusSessionProps as FocusSession,
    FocusStats,
    TimerPreset,
    DayStats,
} from '../src/features/pomo/domain/entities/FocusSession';

export {
    defaultPresets,
    presetIcons,
} from '../src/features/pomo/domain/entities/FocusSession';
