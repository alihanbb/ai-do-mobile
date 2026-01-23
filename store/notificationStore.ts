import { create } from 'zustand';
import { notificationApi, Reminder, CreateReminderRequest } from '../src/core/infrastructure/api/notificationApi';
import { notificationService } from '../src/core/infrastructure/notifications/notificationService';
import { Platform } from 'react-native';

interface NotificationState {
    reminders: Reminder[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    pushToken: string | null;

    fetchReminders: () => Promise<void>;
    createReminder: (data: CreateReminderRequest) => Promise<void>;
    cancelReminder: (id: string) => Promise<void>;
    deleteReminder: (id: string) => Promise<void>;
    registerPushForUser: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    reminders: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    pushToken: null,

    fetchReminders: async () => {
        set({ isLoading: true, error: null });
        try {
            const reminders = await notificationApi.getUserReminders();
            set({ reminders, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Hatırlatıcılar yüklenemedi' });
            console.error(error);
        }
    },

    createReminder: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await notificationApi.createReminder(data);
            await get().fetchReminders();
        } catch (error) {
            set({ isLoading: false, error: 'Hatırlatıcı oluşturulamadı' });
            console.error(error);
            throw error;
        }
    },

    cancelReminder: async (id) => {
        set({ isLoading: true });
        try {
            await notificationApi.cancelReminder(id);
            await get().fetchReminders();
        } catch (error) {
            set({ isLoading: false, error: 'İptal edilemedi' });
            console.error(error);
        }
    },

    deleteReminder: async (id) => {
        set({ isLoading: true });
        try {
            await notificationApi.deleteReminder(id);
            await get().fetchReminders(); // Refresh list
        } catch (error) {
            set({ isLoading: false, error: 'Silinemedi' });
            console.error(error);
        }
    },

    registerPushForUser: async () => {
        try {
            const token = await notificationService.registerForPushNotificationsAsync();
            if (token) {
                console.log('Push Token alındı:', token);
                set({ pushToken: token });
                // Backend'e kaydet
                await notificationApi.registerDeviceToken(token, Platform.OS);
            }
        } catch (error) {
            console.error('Push registration failed:', error);
        }
    }
}));
