// Theme-aware color system for AI-Do Mobile
// Supports both dark and light modes

// Dark Theme Colors (Default)
export const darkColors = {
    // Backgrounds
    background: '#030014',
    surface: 'rgba(20, 20, 20, 0.4)',
    surfaceSolid: '#0a0a0a',
    card: 'rgba(255, 255, 255, 0.02)',

    // Primary - Violet
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#5b21b6',
    primaryGlow: 'rgba(124, 58, 237, 0.6)',

    // Secondary - Cyan
    secondary: '#0891b2',
    secondaryLight: '#67e8f9',
    secondaryDark: '#0e7490',
    secondaryGlow: 'rgba(8, 145, 178, 0.6)',

    // Accent - Pink
    accent: '#db2777',
    accentLight: '#f472b6',
    accentDark: '#be185d',

    // Status
    success: '#22c55e',
    successLight: '#4ade80',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    error: '#ef4444',
    errorLight: '#f87171',
    info: '#3b82f6',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    textDisabled: '#4b5563',

    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.15)',
    borderFocus: 'rgba(124, 58, 237, 0.5)',
};

// Light Theme Colors
export const lightColors = {
    // Backgrounds
    background: '#f8fafc',
    surface: 'rgba(255, 255, 255, 0.8)',
    surfaceSolid: '#ffffff',
    card: 'rgba(0, 0, 0, 0.02)',

    // Primary - Violet
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#5b21b6',
    primaryGlow: 'rgba(124, 58, 237, 0.3)',

    // Secondary - Cyan
    secondary: '#0891b2',
    secondaryLight: '#67e8f9',
    secondaryDark: '#0e7490',
    secondaryGlow: 'rgba(8, 145, 178, 0.3)',

    // Accent - Pink
    accent: '#db2777',
    accentLight: '#f472b6',
    accentDark: '#be185d',

    // Status
    success: '#16a34a',
    successLight: '#22c55e',
    warning: '#d97706',
    warningLight: '#f59e0b',
    error: '#dc2626',
    errorLight: '#ef4444',
    info: '#2563eb',

    // Text
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textDisabled: '#94a3b8',

    // Borders
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.15)',
    borderFocus: 'rgba(124, 58, 237, 0.5)',
};

// Type for colors
export type Colors = typeof darkColors;

// Helper to get colors based on theme
export const getColors = (isDark: boolean): Colors => {
    return isDark ? darkColors : lightColors;
};

// Default export for backwards compatibility
export const colors = darkColors;

// Spacing system
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

// Border radius system
export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
};
