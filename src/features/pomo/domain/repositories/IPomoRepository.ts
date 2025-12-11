// src/features/pomo/domain/repositories/IPomoRepository.ts
// Pomo repository interface

import { FocusSession, FocusStats, TimerPreset } from '../entities/FocusSession';
import { Result } from '../../../../core/domain/value-objects/Result';

export interface IPomoRepository {
    // Session operations
    saveSession(session: FocusSession): Promise<Result<void, Error>>;
    getSessions(): Promise<Result<FocusSession[], Error>>;
    getTodaySessions(): Promise<Result<FocusSession[], Error>>;
    getStats(): Promise<Result<FocusStats, Error>>;

    // Preset operations
    getPresets(): Promise<Result<TimerPreset[], Error>>;
    savePreset(preset: TimerPreset): Promise<Result<void, Error>>;
    deletePreset(id: string): Promise<Result<void, Error>>;
    getActivePreset(): Promise<Result<TimerPreset | null, Error>>;
    setActivePreset(preset: TimerPreset | null): Promise<Result<void, Error>>;
}
