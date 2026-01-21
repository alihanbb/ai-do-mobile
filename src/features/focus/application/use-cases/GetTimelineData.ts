/**
 * Get Timeline Data Use Case
 * Fetches Gantt-style timeline entries from backend API
 */
import { UseCaseWithoutRequest } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { TimelineEntryDTO } from '../dtos/FocusStatsDTO';
import { focusApi } from '../../infrastructure/api/focusApi';

export class GetTimelineData implements UseCaseWithoutRequest<Result<TimelineEntryDTO[]>> {
    async execute(): Promise<Result<TimelineEntryDTO[]>> {
        try {
            const response = await focusApi.getTimelineSessions();

            const entries: TimelineEntryDTO[] = response.map(r => ({
                id: r.id,
                dayOfWeek: r.dayOfWeek,
                startHour: r.startHour,
                endHour: r.endHour,
                durationMinutes: r.durationMinutes,
                presetName: r.presetName,
                color: r.presetColor || '#3b82f6', // Default blue
            }));

            return Result.ok(entries);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

