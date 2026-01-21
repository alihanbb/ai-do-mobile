/**
 * @deprecated Use types from src/features/focus/domain/entities instead
 * This file is kept for backward compatibility during migration
 */
export type { FocusPresetProps as TimerPreset } from '../src/features/focus/domain/entities/FocusPreset';
export type { FocusMode as TimerMode, TimerState } from '../src/features/focus/domain/entities/FocusSession';
export type { FocusStatsDTO as FocusStats } from '../src/features/focus/application/dtos/FocusStatsDTO';
export { DEFAULT_PRESETS as defaultPresets } from '../src/features/focus/domain/entities/FocusPreset';
