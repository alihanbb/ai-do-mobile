import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { getColors, Colors, spacing, borderRadius } from '../../../constants/colors';

interface ThemeContextType {
    colors: Colors;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (mode: 'dark' | 'light' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { isDark, toggleTheme, setTheme, hydrateTheme, isInitialized } = useThemeStore();

    useEffect(() => {
        hydrateTheme();
    }, []);

    const colors = getColors(isDark);

    return (
        <ThemeContext.Provider value={{ colors, isDark, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback for components outside ThemeProvider
        const { isDark, toggleTheme, setTheme } = useThemeStore.getState();
        return {
            colors: getColors(isDark),
            isDark,
            toggleTheme,
            setTheme,
        };
    }
    return context;
};

// Re-export for convenience
export { spacing, borderRadius };
