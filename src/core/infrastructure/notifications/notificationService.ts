import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Bildirim davranışlarını yapılandır (uygulama açıkken)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const notificationService = {
    async registerForPushNotificationsAsync(): Promise<string | undefined> {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (!Device.isDevice) {
            // Simülatörde çalışıyorsa token alamayız, ancak test için null dönebiliriz veya uyarı verebiliriz.
            console.log('Fiziksel cihaz gerekiyor!');
            return undefined; // Simülatörde token yok
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Bildirim izni verilmedi!');
            return undefined;
        }

        // Expo Push Token al
        // Project ID genellikle app.json'dan otomatik alınır, gerekirse buraya eklenebilir.
        try {
            const tokenData = await Notifications.getExpoPushTokenAsync();
            return tokenData.data;
        } catch (error) {
            console.error('Token alma hatası:', error);
            return undefined;
        }
    },

    async scheduleLocalNotification(title: string, body: string, triggerSeconds: number) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: {
                seconds: triggerSeconds,
            },
        });
    }
};
