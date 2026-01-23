import { api } from './apiClient';

export interface Reminder {
    id: string;
    title: string;
    message?: string;
    sourceType: string;
    sourceId: string;
    type: 'Fixed' | 'Offset';
    remindAt?: string;
    channel: 'Push' | 'Email' | 'SMS';
    status: 'Pending' | 'Sent' | 'Failed' | 'Cancelled';
    sentAt?: string;
    createdAt: string;
}

export interface CreateReminderRequest {
    title: string;
    message?: string;
    sourceType: string;
    sourceId: string;
    remindAt?: string;
    offsetType?: 'Minutes' | 'Hours' | 'Days';
    offsetValue?: number;
    referenceDateTime?: string;
    channel?: 'Push' | 'Email' | 'SMS';
}

export interface UpdateReminderRequest {
    title?: string;
    message?: string;
    remindAt?: string;
    channel?: 'Push' | 'Email' | 'SMS';
}

export interface RegisterTokenRequest {
    token: string;
    platform: string;
}

export const notificationApi = {
    // Reminders
    getUserReminders: async (): Promise<Reminder[]> => {
        if (!api) throw new Error('API client is not initialized');
        const response = await api.get<{ reminders: Reminder[] }>('/reminders');
        return response.data.reminders;
    },

    getReminder: async (id: string): Promise<Reminder> => {
        const response = await api.get<Reminder>(`/reminders/${id}`);
        return response.data;
    },

    createReminder: async (data: CreateReminderRequest): Promise<Reminder> => {
        const response = await api.post<Reminder>('/reminders', data);
        return response.data;
    },

    updateReminder: async (id: string, data: UpdateReminderRequest): Promise<Reminder> => {
        const response = await api.put<Reminder>(`/reminders/${id}`, data);
        return response.data;
    },

    deleteReminder: async (id: string): Promise<void> => {
        await api.delete(`/reminders/${id}`);
    },

    cancelReminder: async (id: string): Promise<void> => {
        await api.post(`/reminders/${id}/cancel`);
    },

    // Device Tokens
    registerDeviceToken: async (token: string, platform: string): Promise<void> => {
        await api.post('/notifications/register-token', { token, platform });
    }
};
