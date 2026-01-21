import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from './locales/tr.json';
import en from './locales/en.json';

const LANGUAGE_KEY = 'user_language';

// Language detection plugin
const languageDetectorPlugin = {
    type: 'languageDetector' as const,
    async: true,
    init: () => { },
    detect: async (callback: (lang: string) => void) => {
        try {
            // First check if user has saved a preference
            const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLang) {
                callback(savedLang);
                return;
            }

            // Fall back to device language
            const locales = Localization.getLocales();
            const deviceLang = locales[0]?.languageCode || 'tr';
            const supportedLang = deviceLang === 'tr' ? 'tr' : 'en';
            callback(supportedLang);
        } catch (error) {
            console.error('Error detecting language:', error);
            callback('tr'); // Default to Turkish
        }
    },
    cacheUserLanguage: async (lang: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch (error) {
            console.error('Error caching language:', error);
        }
    },
};

// Initialize i18next
i18n
    .use(languageDetectorPlugin)
    .use(initReactI18next)
    .init({
        resources: {
            tr: { translation: tr },
            en: { translation: en },
        },
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false, // React already handles escaping
        },
        react: {
            useSuspense: false, // Disable suspense for React Native
        },
    });

// Export language change function
export const changeLanguage = async (lang: 'tr' | 'en'): Promise<void> => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
};

// Export current language getter
export const getCurrentLanguage = (): string => {
    return i18n.language || 'tr';
};

export default i18n;
