import { Platform } from 'react-native';
const getApiBaseUrl = (): string => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:5000/api';
        }
        return 'http://localhost:5000/api';
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
