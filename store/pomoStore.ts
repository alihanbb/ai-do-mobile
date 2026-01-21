/**
 * @deprecated Use useFocusStore from src/features/focus/presentation/stores instead
 * This file is kept for backward compatibility during migration
 */
export { useFocusStore as usePomoStore } from '../src/features/focus/presentation/stores/useFocusStore';
export type { FocusPresetProps as TimerPreset } from '../src/features/focus/domain/entities/FocusPreset';
export { DEFAULT_PRESETS as defaultPresets } from '../src/features/focus/domain/entities/FocusPreset';
