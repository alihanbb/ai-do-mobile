import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { getColors, borderRadius, spacing } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    style,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const paddingValues: Record<string, number> = {
        none: 0,
        sm: spacing.sm,
        md: spacing.lg,
        lg: spacing.xxl,
    };

    const variantStyles: Record<string, ViewStyle> = {
        default: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 2,
        },
        elevated: {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 0,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border,
        },
    };

    return (
        <View
            style={[
                styles.card,
                variantStyles[variant],
                { padding: paddingValues[padding] },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        // overflow: 'hidden', // Removing overflow hidden to allow shadows on iOS
    },
});
