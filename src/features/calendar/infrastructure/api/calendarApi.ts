import { apiClient, parseApiError } from '../../../../core/infrastructure/api/apiClient';
import {
    CalendarEventDto,
    CalendarEventSummaryDto,
    DaySummaryDto,
    CreateCalendarEventRequest
} from '../../domain/types';

export const calendarApi = {
    // Events
    async getEvents(startDate?: Date, endDate?: Date): Promise<CalendarEventSummaryDto[]> {
        try {
            const response = await apiClient.get<CalendarEventSummaryDto[]>('v1/calendar/events', {
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

    async getEventsByDay(date: Date): Promise<DaySummaryDto> {
        try {
            // Using ISO string might be unsafe in path due to colons
            // Safer to pass as query param or formatted string
            // But backend expects path param. Let's send YYYY-MM-DD which .NET binds easily
            const dateStr = date.toISOString().split('T')[0];
            const response = await apiClient.get<DaySummaryDto>(`v1/calendar/events/day/${dateStr}`);
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async getEventsByMonth(year: number, month: number): Promise<CalendarEventSummaryDto[]> {
        try {
            // backend expects month 1-12
            const response = await apiClient.get<CalendarEventSummaryDto[]>(`v1/calendar/events/month/${year}/${month}`);
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async createEvent(request: CreateCalendarEventRequest): Promise<CalendarEventDto> {
        try {
            const response = await apiClient.post<CalendarEventDto>('v1/calendar/events', request);
            return response.data;
        } catch (error) {
            throw parseApiError(error);
        }
    },

    // Integrations
    async connectGoogle(code: string, redirectUri: string): Promise<string> {
        try {
            const response = await apiClient.post('v1/calendar/integrations/google/connect', { code, redirectUri });
            return response.data.id || 'connected';
        } catch (error) {
            throw parseApiError(error);
        }
    },

    async syncGoogle(): Promise<void> {
        try {
            await apiClient.post('v1/calendar/sync');
        } catch (error) {
            throw parseApiError(error);
        }
    }
};
