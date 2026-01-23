/**
 * Analytics API Client
 * Communicates with backend Analytics module endpoints
 */
import { apiClient, parseApiError } from '../../../../core/infrastructure/api/apiClient';

// API Response Types (matching backend DTOs)
export interface AnalyticsResponse {
    tasksCompleted: number;
    tasksCreated: number;
    focusMinutes: number;
    currentStreak: number;
    longestStreak: number;
    dailyStats: DailyStatResponse[];
}

export interface DailyStatResponse {
    date: string;
    completed: number;
    created: number;
    focusMinutes: number;
}

export interface StreaksResponse {
    currentStreak: number;
    longestStreak: number;
    completedToday: boolean;
}

export interface PeakHoursResponse {
    peakHour: number | null;
    peakTimeRange: string;
    hourlyActivity: Record<string, number>;
}

export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'trend';

/**
 * Analytics API Functions
 */
export const analyticsApi = {
    /**
     * Get general analytics for a period
     */
    async getAnalytics(period: AnalyticsPeriod = 'day'): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get<AnalyticsResponse>('/api/analytics', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    /**
     * Get streak information
     */
    async getStreaks(): Promise<StreaksResponse> {
        try {
            const response = await apiClient.get<StreaksResponse>('/api/analytics/streaks');
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    /**
     * Get peak hours activity
     */
    async getPeakHours(period: 'week' | 'month' = 'week'): Promise<PeakHoursResponse> {
        try {
            const response = await apiClient.get<PeakHoursResponse>('/api/analytics/peak-hours', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    /**
     * Get daily analytics
     */
    async getDailyAnalytics(date?: Date): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get<AnalyticsResponse>('/api/analytics/daily', {
                params: date ? { date: date.toISOString().split('T')[0] } : undefined
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    /**
     * Get weekly analytics
     */
    async getWeeklyAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get<AnalyticsResponse>('/api/analytics/weekly');
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    /**
     * Get monthly analytics
     */
    async getMonthlyAnalytics(): Promise<AnalyticsResponse> {
        try {
            const response = await apiClient.get<AnalyticsResponse>('/api/analytics/monthly');
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },
};
