export interface CalendarEventDto {
    id: string;
    userId: string;
    title: string;
    description?: string;
    location?: string;
    color?: string;
    startDateTime: string;
    endDateTime: string;
    isAllDay: boolean;
    timeZone?: string;
    recurrenceRule?: string;
    status: string;
    linkedTaskId?: string;
    externalId?: string;
    externalSource?: string;
    syncStatus: string;
    lastSyncedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CalendarEventSummaryDto {
    id: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    isAllDay: boolean;
    color?: string;
    status: string;
    linkedTaskId?: string;
}

export interface DaySummaryDto {
    date: string;
    eventCount: number;
    events: CalendarEventSummaryDto[];
}

export interface CreateCalendarEventRequest {
    title: string;
    startDateTime: string;
    endDateTime: string;
    description?: string;
    location?: string;
    color?: string;
    isAllDay?: boolean;
    timeZone?: string;
    linkedTaskId?: string;
    recurrenceRule?: string;
}

export interface ConnectGoogleRequest {
    code: string;
    redirectUri: string;
}
