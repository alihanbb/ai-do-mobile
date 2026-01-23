import { Platform } from 'react-native';

const getApiBaseUrl = (): string => {
    if (__DEV__) {
        // Local backend server - use your computer's IP address for physical devices
        // Use 'localhost' or '127.0.0.1' for iOS Simulator
        // Use '10.0.2.2' for Android Emulator  
        // Use actual IP for real device on same network
        return Platform.select({
            ios: 'http://192.168.1.103:5208/api/',
            android: 'http://192.168.1.103:5208/api/',
            default: 'http://192.168.1.103:5208/api/'
        });
    }
    return 'https://api.aido.app/api';
};

export const config = {
    api: {
        baseUrl: getApiBaseUrl(),
        timeout: 30000,
    },
    auth: {
        tokenKey: 'auth_token',
        refreshTokenKey: 'refresh_token',
        userDataKey: 'user_data',
    },
};
