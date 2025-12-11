// src/features/pomo/infrastructure/repositories/PomoRepository.ts
// Pomo repository implementation

import { FocusSession, FocusSessionProps, FocusStats, TimerPreset, DayStats, defaultPresets } from '../../domain/entities/FocusSession';
import { IPomoRepository } from '../../domain/repositories/IPomoRepository';
import { Result } from '../../../../core/domain/value-objects/Result';
import { IStorageAdapter } from '../../../../core/infrastructure/storage/IStorageAdapter';
import { asyncStorage } from '../../../../core/infrastructure/storage';

const SESSIONS_KEY = 'pomo_sessions';
const PRESETS_KEY = 'pomo_presets';
const ACTIVE_PRESET_KEY = 'pomo_active_preset';

export class PomoRepository implements IPomoRepository {
    constructor(private readonly storage: IStorageAdapter = asyncStorage) { }

    async saveSession(session: FocusSession): Promise<Result<void, Error>> {
        try {
            const sessionsResult = await this.getSessions();
            const sessions = sessionsResult.isSuccess ? sessionsResult.value : [];
            sessions.push(session);

            const sessionProps = sessions.map(s => s.toJSON());
            await this.storage.set(SESSIONS_KEY, sessionProps);

            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to save session'));
        }
    }

    async getSessions(): Promise<Result<FocusSession[], Error>> {
        try {
            const sessions = await this.storage.get<FocusSessionProps[]>(SESSIONS_KEY);
            if (sessions) {
                return Result.ok(sessions.map(s => FocusSession.fromJSON(s)));
            }
            return Result.ok([]);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get sessions'));
        }
    }

    async getTodaySessions(): Promise<Result<FocusSession[], Error>> {
        try {
            const allSessionsResult = await this.getSessions();
            if (allSessionsResult.isFailure) return allSessionsResult;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todaySessions = allSessionsResult.value.filter(session => {
                const sessionDate = new Date(session.startedAt);
                return sessionDate >= today && sessionDate < tomorrow;
            });

            return Result.ok(todaySessions);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get today sessions'));
        }
    }

    async getStats(): Promise<Result<FocusStats, Error>> {
        try {
            const sessionsResult = await this.getSessions();
            const sessions = sessionsResult.isSuccess ? sessionsResult.value : [];

            const todaySessionsResult = await this.getTodaySessions();
            const todaySessions = todaySessionsResult.isSuccess ? todaySessionsResult.value : [];

            const totalFocusTime = sessions.reduce((acc, s) => acc + s.durationInMinutes, 0);
            const todayFocusTime = todaySessions.reduce((acc, s) => acc + s.durationInMinutes, 0);
            const avgSession = sessions.length > 0 ? totalFocusTime / sessions.length : 0;
            const longestSession = sessions.reduce((max, s) => Math.max(max, s.durationInMinutes), 0);

            const stats: FocusStats = {
                totalSessions: sessions.length,
                totalFocusTime,
                todaySessions: todaySessions.length,
                todayFocusTime,
                averageSessionLength: avgSession,
                longestSession,
                currentStreak: 0, // Would need more complex calculation
                todayPomoCount: todaySessions.length,
                todayFocusDuration: todayFocusTime,
                totalPomoCount: sessions.length,
                totalFocusDuration: totalFocusTime,
            };

            return Result.ok(stats);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get stats'));
        }
    }

    async getPresets(): Promise<Result<TimerPreset[], Error>> {
        try {
            const presets = await this.storage.get<TimerPreset[]>(PRESETS_KEY);
            return Result.ok(presets || [...defaultPresets]);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get presets'));
        }
    }

    async savePreset(preset: TimerPreset): Promise<Result<void, Error>> {
        try {
            const presetsResult = await this.getPresets();
            const presets = presetsResult.isSuccess ? presetsResult.value : [...defaultPresets];

            const existingIndex = presets.findIndex(p => p.id === preset.id);
            if (existingIndex >= 0) {
                presets[existingIndex] = preset;
            } else {
                presets.push(preset);
            }

            await this.storage.set(PRESETS_KEY, presets);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to save preset'));
        }
    }

    async deletePreset(id: string): Promise<Result<void, Error>> {
        try {
            const presetsResult = await this.getPresets();
            if (presetsResult.isFailure) return Result.fail(presetsResult.error);

            const presets = presetsResult.value.filter(p => p.id !== id);
            await this.storage.set(PRESETS_KEY, presets);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to delete preset'));
        }
    }

    async getActivePreset(): Promise<Result<TimerPreset | null, Error>> {
        try {
            const preset = await this.storage.get<TimerPreset>(ACTIVE_PRESET_KEY);
            return Result.ok(preset);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to get active preset'));
        }
    }

    async setActivePreset(preset: TimerPreset | null): Promise<Result<void, Error>> {
        try {
            if (preset) {
                await this.storage.set(ACTIVE_PRESET_KEY, preset);
            } else {
                await this.storage.remove(ACTIVE_PRESET_KEY);
            }
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error instanceof Error ? error : new Error('Failed to set active preset'));
        }
    }
}

// Singleton instance
export const pomoRepository = new PomoRepository();
