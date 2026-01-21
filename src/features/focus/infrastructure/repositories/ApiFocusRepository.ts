/**
 * API Focus Repository
 * Backend API-based implementation of IFocusRepository
 */
import { Result } from '../../../../core/types/Result';
import { FocusSession, FocusSessionProps } from '../../domain/entities/FocusSession';
import { IFocusRepository } from '../../domain/repositories/IFocusRepository';
import { focusApi, FocusSessionResponse } from '../api/focusApi';

export class ApiFocusRepository implements IFocusRepository {

    private mapResponseToProps(response: FocusSessionResponse): FocusSessionProps {
        return {
            id: response.id,
            mode: response.mode.toLowerCase() as 'pomodoro' | 'stopwatch',
            durationSeconds: response.durationSeconds,
            pausedDurationSeconds: 0, // Not tracked in backend response
            startedAt: new Date(response.startedAt),
            endedAt: response.completedAt ? new Date(response.completedAt) : undefined,
            isCompleted: response.isCompleted,
            presetId: response.presetId,
            presetName: response.presetName,
            linkedTaskId: response.linkedTaskId,
            linkedTaskTitle: response.linkedTaskTitle,
            createdAt: new Date(response.createdAt),
            updatedAt: response.updatedAt ? new Date(response.updatedAt) : new Date(response.createdAt),
        };
    }

    async save(session: FocusSession): Promise<Result<void>> {
        try {
            // Check if this is a new session or completion
            if (!session.isCompleted && !session.endedAt) {
                // New session - start it
                await focusApi.startSession({
                    mode: session.mode === 'pomodoro' ? 'Pomodoro' : 'Stopwatch',
                    presetId: session.presetId,
                    presetName: session.presetName,
                    linkedTaskId: session.linkedTaskId,
                    linkedTaskTitle: session.linkedTaskTitle,
                });
            } else if (session.isCompleted) {
                // Complete the session
                await focusApi.completeSession(session.id, {
                    durationSeconds: session.durationSeconds,
                    wasSuccessful: true,
                });
            }
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getAll(): Promise<Result<FocusSession[]>> {
        try {
            const responses = await focusApi.getSessions(1, 100);
            const sessions = responses.map(r => FocusSession.fromProps(this.mapResponseToProps(r)));
            return Result.ok(sessions);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getById(id: string): Promise<Result<FocusSession | null>> {
        try {
            const responses = await focusApi.getSessions(1, 100);
            const found = responses.find(r => r.id === id);
            if (!found) return Result.ok(null);
            return Result.ok(FocusSession.fromProps(this.mapResponseToProps(found)));
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getByDateRange(startDate: Date, endDate: Date): Promise<Result<FocusSession[]>> {
        try {
            const responses = await focusApi.getSessions(1, 100);
            const filtered = responses.filter(r => {
                const sessionDate = new Date(r.startedAt);
                return sessionDate >= startDate && sessionDate <= endDate;
            });
            const sessions = filtered.map(r => FocusSession.fromProps(this.mapResponseToProps(r)));
            return Result.ok(sessions);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getToday(): Promise<Result<FocusSession[]>> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.getByDateRange(today, tomorrow);
    }

    async getThisWeek(): Promise<Result<FocusSession[]>> {
        const now = new Date();
        const startOfWeek = new Date(now);
        const daysSinceMonday = (now.getDay() + 6) % 7;
        startOfWeek.setDate(now.getDate() - daysSinceMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return this.getByDateRange(startOfWeek, endOfWeek);
    }

    async delete(id: string): Promise<Result<void>> {
        try {
            await focusApi.cancelSession(id);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

