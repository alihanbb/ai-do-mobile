// =============================================================================
// TEMA: CYBER EMERALD 💎
// Modern Dark Theme with Emerald & Amber Accents - AI-Powered Productivity
// =============================================================================

// Gradient Presets - Use these for consistent gradient styling
export const gradients = {
    // Primary Flow Gradient (Emerald → Cyan → Amber)
    aurora: ['#34D399', '#22D3EE', '#FBBF24'] as const,
    auroraReverse: ['#FBBF24', '#22D3EE', '#34D399'] as const,

    // Action Gradients (Emerald-based)
    primary: ['#34D399', '#10B981'] as const,
    primaryBold: ['#6EE7B7', '#34D399'] as const,

    // CTA & Buttons (Emerald-based)
    cta: ['#34D399', '#10B981'] as const,
    ctaHot: ['#4ADE80', '#22C55E'] as const,

    // Premium/Special (Amber gold)
    premium: ['#FBBF24', '#F59E0B', '#D97706'] as const,
    premiumSubtle: ['#34D399', '#22D3EE', '#FBBF24'] as const,

    // Status Gradients
    success: ['#4ADE80', '#22C55E'] as const,
    danger: ['#FB7185', '#F43F5E'] as const,

    // Background Atmospheres
    darkVoid: ['#000000', '#020A05', '#000000'] as const,
    deepSpace: ['#000503', '#051210', '#000000'] as const,
};

// Dark Theme Colors - Emerald Focus
export const darkColors = {
    // Backgrounds - Deep Forest Void
    background: '#000000',      // True Black for OLED
    surface: '#040D08',         // Subtle emerald-tinted dark
    surfaceSolid: '#061410',    // Solid surface for cards
    surfaceElevated: '#0A1A14', // Elevated elements
    card: 'rgba(8, 18, 12, 0.85)',

    // Primary - Emerald Green (Main Actions) 💚
    primary: '#34D399',         // Emerald 400 - Main actions
    primaryLight: '#6EE7B7',    // Emerald 300 - Hover states
    primaryDark: '#10B981',     // Emerald 500 - Pressed states
    primaryGlow: 'rgba(52, 211, 153, 0.4)',
    primaryMuted: 'rgba(52, 211, 153, 0.15)',

    // Secondary - Electric Cyan (Data & Info)
    secondary: '#22D3EE',       // Cyan 400
    secondaryLight: '#67E8F9',  // Cyan 300
    secondaryDark: '#06B6D4',   // Cyan 500
    secondaryGlow: 'rgba(34, 211, 238, 0.4)',
    secondaryMuted: 'rgba(34, 211, 238, 0.15)',

    // Accent - Warm Amber (Highlights & Attention)
    accent: '#FBBF24',          // Amber 400
    accentLight: '#FDE047',     // Yellow 300
    accentDark: '#F59E0B',      // Amber 500
    accentGlow: 'rgba(251, 191, 36, 0.4)',
    accentMuted: 'rgba(251, 191, 36, 0.15)',

    // Status Colors - Vivid but not harsh
    success: '#4ADE80',         // Green 400
    successLight: '#86EFAC',    // Green 300
    successDark: '#22C55E',     // Green 500
    successMuted: 'rgba(74, 222, 128, 0.15)',

    warning: '#FACC15',         // Yellow 400
    warningLight: '#FDE047',    // Yellow 300
    warningDark: '#EAB308',     // Yellow 500
    warningMuted: 'rgba(250, 204, 21, 0.15)',

    error: '#F87171',           // Red 400
    errorLight: '#FCA5A5',      // Red 300
    errorDark: '#EF4444',       // Red 500
    errorMuted: 'rgba(248, 113, 113, 0.15)',

    info: '#60A5FA',            // Blue 400
    infoLight: '#93C5FD',       // Blue 300
    infoDark: '#3B82F6',        // Blue 500

    // Text Hierarchy
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',   // Zinc 400
    textMuted: '#52525B',       // Zinc 600
    textDisabled: '#3F3F46',    // Zinc 700
    textInverse: '#09090B',     // Zinc 950

    // Borders & Dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
    borderHover: 'rgba(52, 211, 153, 0.5)',
    borderFocus: '#34D399',
    borderActive: '#22D3EE',

    // Shadows & Glows
    shadow: 'rgba(0, 0, 0, 0.9)',
    shadowColored: 'rgba(52, 211, 153, 0.25)',
    glow: 'rgba(52, 211, 153, 0.6)',

    // Special Purpose
    overlay: 'rgba(0, 0, 0, 0.85)',
    skeleton: 'rgba(255, 255, 255, 0.05)',
    ripple: 'rgba(52, 211, 153, 0.2)',
};

// Light Theme Colors - Emerald Light
export const lightColors = {
    // Backgrounds
    background: '#F0FDF9',
    surface: '#FFFFFF',
    surfaceSolid: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Primary - Emerald
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    primaryGlow: 'rgba(16, 185, 129, 0.15)',
    primaryMuted: 'rgba(16, 185, 129, 0.08)',

    // Secondary - Cyan
    secondary: '#06B6D4',
    secondaryLight: '#22D3EE',
    secondaryDark: '#0891B2',
    secondaryGlow: 'rgba(6, 182, 212, 0.15)',
    secondaryMuted: 'rgba(6, 182, 212, 0.08)',

    // Accent - Amber
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    accentGlow: 'rgba(245, 158, 11, 0.15)',
    accentMuted: 'rgba(245, 158, 11, 0.08)',

    // Status
    success: '#22C55E',
    successLight: '#4ADE80',
    successDark: '#16A34A',
    successMuted: 'rgba(34, 197, 94, 0.1)',

    warning: '#EAB308',
    warningLight: '#FACC15',
    warningDark: '#CA8A04',
    warningMuted: 'rgba(234, 179, 8, 0.1)',

    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    errorMuted: 'rgba(239, 68, 68, 0.1)',

    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoDark: '#2563EB',

    // Text
    textPrimary: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    textDisabled: '#D4D4D8',
    textInverse: '#FFFFFF',

    // Borders
    border: '#D1FAE5',
    borderLight: '#ECFDF5',
    borderHover: '#6EE7B7',
    borderFocus: '#06B6D4',
    borderActive: '#10B981',

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowColored: 'rgba(6, 182, 212, 0.1)',
    glow: 'rgba(6, 182, 212, 0.2)',

    // Special
    overlay: 'rgba(0, 0, 0, 0.5)',
    skeleton: 'rgba(0, 0, 0, 0.05)',
    ripple: 'rgba(6, 182, 212, 0.15)',
};

// Type for colors
export type Colors = typeof darkColors;
export type Gradients = typeof gradients;

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
    giant: 48,
};

// Border radius system
export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    full: 9999,
};

// Typography (optional - for consistent font sizing)
export const typography = {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    tiny: 10,
};

// Animation durations
export const animation = {
    fast: 150,
    normal: 300,
    slow: 500,
};
