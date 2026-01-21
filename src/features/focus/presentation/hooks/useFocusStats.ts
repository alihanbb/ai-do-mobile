/**
 * Focus Stats Hook
 * Fetches and provides focus statistics using use cases
 */
import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../../core/di/container';
import { FocusStatsDTO, HourlyStatsDTO, TimelineEntryDTO } from '../../application/dtos/FocusStatsDTO';

interface UseFocusStatsReturn {
    stats: FocusStatsDTO | null;
    hourlyStats: HourlyStatsDTO[];
    timelineData: TimelineEntryDTO[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useFocusStats = (): UseFocusStatsReturn => {
    const [stats, setStats] = useState<FocusStatsDTO | null>(null);
    const [hourlyStats, setHourlyStats] = useState<HourlyStatsDTO[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineEntryDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch all stats in parallel
            const [statsResult, hourlyResult, timelineResult] = await Promise.all([
                container.getFocusStats.execute(),
                container.getHourlyStats.execute(),
                container.getTimelineData.execute(),
            ]);

            if (statsResult.isSuccess) {
                setStats(statsResult.value);
            } else {
                setError(statsResult.error.message);
            }

            if (hourlyResult.isSuccess) {
                setHourlyStats(hourlyResult.value);
            }

            if (timelineResult.isSuccess) {
                setTimelineData(timelineResult.value);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        stats,
        hourlyStats,
        timelineData,
        isLoading,
        error,
        refresh,
    };
};
