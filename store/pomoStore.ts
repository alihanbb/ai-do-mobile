// store/pomoStore.ts
// Re-export from new Clean Architecture location

export { usePomoStore } from '../src/features/pomo/presentation/stores/usePomoStore';

// Re-export pomo types for convenience
export type {
    TimerMode,
    TimerState,
    TimerPreset,
    FocusSessionProps as FocusSession,
    FocusStats,
    DayStats,
} from '../src/features/pomo/domain/entities/FocusSession';

export {
    defaultPresets,
    presetIcons,
} from '../src/features/pomo/domain/entities/FocusSession';
