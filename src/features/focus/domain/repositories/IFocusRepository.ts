/**
 * Focus Repository Interface
 * Contract for focus session persistence
 */
import { Result } from '../../../../core/types/Result';
import { FocusSession } from '../entities/FocusSession';

export interface IFocusRepository {
    save(session: FocusSession): Promise<Result<void>>;
    getAll(): Promise<Result<FocusSession[]>>;
    getById(id: string): Promise<Result<FocusSession | null>>;
    getByDateRange(startDate: Date, endDate: Date): Promise<Result<FocusSession[]>>;
    getToday(): Promise<Result<FocusSession[]>>;
    getThisWeek(): Promise<Result<FocusSession[]>>;
    delete(id: string): Promise<Result<void>>;
}
