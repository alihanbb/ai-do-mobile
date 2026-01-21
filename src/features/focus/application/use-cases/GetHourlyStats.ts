/**
 * Get Hourly Stats Use Case
 * Fetches hourly focus distribution from backend API
 */
import { UseCaseWithoutRequest } from '../../../../core/application/UseCase';
import { Result } from '../../../../core/types/Result';
import { HourlyStatsDTO } from '../dtos/FocusStatsDTO';
import { focusApi } from '../../infrastructure/api/focusApi';

export class GetHourlyStats implements UseCaseWithoutRequest<Result<HourlyStatsDTO[]>> {
    async execute(): Promise<Result<HourlyStatsDTO[]>> {
        try {
            const response = await focusApi.getHourlyStats();

            const hourlyData: HourlyStatsDTO[] = response.map(r => ({
                hour: r.hour,
                focusMinutes: r.focusMinutes,
            }));

            return Result.ok(hourlyData);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

