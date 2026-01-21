/**
 * Local Focus Repository
 * AsyncStorage-based implementation
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Result } from '../../../../core/types/Result';
import { FocusSession, FocusSessionProps } from '../../domain/entities/FocusSession';
import { IFocusRepository } from '../../domain/repositories/IFocusRepository';

const STORAGE_KEY = 'focus_sessions';

export class LocalFocusRepository implements IFocusRepository {
    async save(session: FocusSession): Promise<Result<void>> {
        try {
            const sessions = await this.getAllProps();
            const index = sessions.findIndex(s => s.id === session.id);

            if (index >= 0) {
                sessions[index] = session.toProps();
            } else {
                sessions.push(session.toProps());
            }

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getAll(): Promise<Result<FocusSession[]>> {
        try {
            const props = await this.getAllProps();
            const sessions = props.map(p => FocusSession.fromProps(p));
            return Result.ok(sessions);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getById(id: string): Promise<Result<FocusSession | null>> {
        try {
            const props = await this.getAllProps();
            const found = props.find(p => p.id === id);
            return Result.ok(found ? FocusSession.fromProps(found) : null);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async getByDateRange(startDate: Date, endDate: Date): Promise<Result<FocusSession[]>> {
        try {
            const props = await this.getAllProps();
            const filtered = props.filter(p => {
                const sessionDate = new Date(p.startedAt);
                return sessionDate >= startDate && sessionDate <= endDate;
            });
            return Result.ok(filtered.map(p => FocusSession.fromProps(p)));
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
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return this.getByDateRange(startOfWeek, endOfWeek);
    }

    async delete(id: string): Promise<Result<void>> {
        try {
            const sessions = await this.getAllProps();
            const filtered = sessions.filter(s => s.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    private async getAllProps(): Promise<FocusSessionProps[]> {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data) as FocusSessionProps[];
    }
}
