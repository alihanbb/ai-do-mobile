import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../constants/colors';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    style,
}) => {
    const paddingValues: Record<string, number> = {
        none: 0,
        sm: spacing.sm,
        md: spacing.lg,
        lg: spacing.xxl,
    };

    const variantStyles: Record<string, ViewStyle> = {
        default: {
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
        },
        elevated: {
            backgroundColor: colors.surfaceSolid,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
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
        overflow: 'hidden',
    },
});
