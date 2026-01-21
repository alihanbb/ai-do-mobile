/**
 * Focus API Client
 * Communicates with backend Focus module endpoints
 */
import { apiClient, parseApiError } from '../../../../core/infrastructure/api/apiClient';

// API Response Types (matching backend DTOs)
export interface FocusStatsResponse {
    totalSessions: number;
    totalFocusMinutes: number;
    todaySessions: number;
    todayFocusMinutes: number;
    todayPomoCount: number;
    totalPomoCount: number;
    averageSessionMinutes: number;
    longestSessionMinutes: number;
    currentStreak: number;
    longestStreak: number;
}

export interface HourlyStatsResponse {
    hour: number;
    focusMinutes: number;
    sessionCount: number;
}

export interface TimelineSessionResponse {
    id: string;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    durationMinutes: number;
    presetName?: string;
    presetColor?: string;
    mode: string;
}

export interface DayStatsResponse {
    date: string;
    pomoCount: number;
    focusMinutes: number;
    sessionCount: number;
}

export interface FocusSessionResponse {
    id: string;
    userId: string;
    mode: string;
    presetId?: string;
    presetName?: string;
    presetDurationMinutes?: number;
    linkedTaskId?: string;
    linkedTaskTitle?: string;
    startedAt: string;
    pausedAt?: string;
    resumedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    durationSeconds: number;
    durationMinutes: number;
    status: string;
    isCompleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface StartFocusSessionRequest {
    mode: 'Pomodoro' | 'Stopwatch';
    presetId?: string;
    presetName?: string;
    presetDurationMinutes?: number;
    linkedTaskId?: string;
    linkedTaskTitle?: string;
}

export interface CompleteFocusSessionRequest {
    durationSeconds: number;
    wasSuccessful?: boolean;
}

/**
 * Focus API Functions
 */
export const focusApi = {
    // Stats endpoints
    async getStats(period: string = 'all'): Promise<FocusStatsResponse> {
        try {
            const response = await apiClient.get<FocusStatsResponse>('/api/focus/stats', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async getHourlyStats(date?: Date): Promise<HourlyStatsResponse[]> {
        try {
            const response = await apiClient.get<HourlyStatsResponse[]>('/api/focus/stats/hourly', {
                params: date ? { date: date.toISOString() } : undefined
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async getTimelineSessions(startDate?: Date, endDate?: Date): Promise<TimelineSessionResponse[]> {
        try {
            const response = await apiClient.get<TimelineSessionResponse[]>('/api/focus/stats/timeline', {
                params: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async getDailyTrend(days: number = 7): Promise<DayStatsResponse[]> {
        try {
            const response = await apiClient.get<DayStatsResponse[]>('/api/focus/stats/daily', {
                params: { days }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    // Session endpoints
    async getSessions(page: number = 1, pageSize: number = 20): Promise<FocusSessionResponse[]> {
        try {
            const response = await apiClient.get<FocusSessionResponse[]>('/api/focus/sessions', {
                params: { page, pageSize }
            });
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async getActiveSession(): Promise<FocusSessionResponse | null> {
        try {
            const response = await apiClient.get<FocusSessionResponse>('/api/focus/sessions/active');
            return response.data;
        } catch (error) {
            const apiError = parseApiError(error);
            if (apiError.status === 404) {
                return null;
            }
            throw apiError;
        }
    },

    async startSession(request: StartFocusSessionRequest): Promise<FocusSessionResponse> {
        try {
            const response = await apiClient.post<FocusSessionResponse>('/api/focus/sessions', request);
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async pauseSession(sessionId: string): Promise<void> {
        try {
            await apiClient.patch(`/api/focus/sessions/${sessionId}/pause`);
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async resumeSession(sessionId: string): Promise<void> {
        try {
            await apiClient.patch(`/api/focus/sessions/${sessionId}/resume`);
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async completeSession(sessionId: string, request: CompleteFocusSessionRequest): Promise<void> {
        try {
            await apiClient.patch(`/api/focus/sessions/${sessionId}/complete`, request);
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async cancelSession(sessionId: string): Promise<void> {
        try {
            await apiClient.patch(`/api/focus/sessions/${sessionId}/cancel`);
        } catch (error) {
            throw parseApiError(error);
        }
    },
};
