import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
    mode: ThemeMode;
    isDark: boolean;
    isInitialized: boolean;

    // Actions
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    hydrateTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = 'ai-do-theme';

const getSystemTheme = (): boolean => {
    return Appearance.getColorScheme() === 'dark';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
    mode: 'dark',
    isDark: true,
    isInitialized: false,

    setTheme: async (mode: ThemeMode) => {
        const isDark = mode === 'system' ? getSystemTheme() : mode === 'dark';
        set({ mode, isDark });

        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    },

    toggleTheme: () => {
        const { mode } = get();
        const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
        get().setTheme(newMode);
    },

    hydrateTheme: async () => {
        try {
            const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
            const mode = savedMode || 'dark';
            const isDark = mode === 'system' ? getSystemTheme() : mode === 'dark';

            set({ mode, isDark, isInitialized: true });
        } catch (error) {
            console.error('Failed to load theme:', error);
            set({ isInitialized: true });
        }
    },
}));

// Listen for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
    const { mode } = useThemeStore.getState();
    if (mode === 'system') {
        useThemeStore.setState({ isDark: colorScheme === 'dark' });
    }
});
