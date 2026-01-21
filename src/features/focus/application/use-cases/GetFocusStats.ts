/**
 * Get Focus Stats Use Case
 * Fetches focus statistics from backend API
 */
import { UseCaseWithoutRequest } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { FocusStatsDTO } from '../dtos/FocusStatsDTO';
import { focusApi } from '../../infrastructure/api/focusApi';

export class GetFocusStats implements UseCaseWithoutRequest<Result<FocusStatsDTO>> {
    async execute(): Promise<Result<FocusStatsDTO>> {
        try {
            const response = await focusApi.getStats('all');

            const stats: FocusStatsDTO = {
                totalSessions: response.totalSessions,
                totalFocusMinutes: response.totalFocusMinutes,
                todaySessions: response.todaySessions,
                todayFocusMinutes: response.todayFocusMinutes,
                todayPomoCount: response.todayPomoCount,
                totalPomoCount: response.totalPomoCount,
                averageSessionMinutes: response.averageSessionMinutes,
                longestSessionMinutes: response.longestSessionMinutes,
                currentStreak: response.currentStreak,
            };

            return Result.ok(stats);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

