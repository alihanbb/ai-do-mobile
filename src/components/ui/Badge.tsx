import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../constants/colors';

interface BadgeProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'default',
    size = 'sm',
    icon,
    style,
}) => {
    const variantColors: Record<string, { bg: string; text: string }> = {
        default: { bg: 'rgba(255,255,255,0.1)', text: colors.textSecondary },
        success: { bg: 'rgba(34, 197, 94, 0.15)', text: colors.success },
        warning: { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning },
        error: { bg: 'rgba(239, 68, 68, 0.15)', text: colors.error },
        info: { bg: 'rgba(59, 130, 246, 0.15)', text: colors.info },
        primary: { bg: 'rgba(124, 58, 237, 0.15)', text: colors.primary },
    };

    const sizeStyles = {
        sm: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 11 },
        md: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13 },
    };

    const current = variantColors[variant];
    const currentSize = sizeStyles[size];

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: current.bg,
                    paddingVertical: currentSize.paddingVertical,
                    paddingHorizontal: currentSize.paddingHorizontal,
                },
                style,
            ]}
        >
            {icon}
            <Text
                style={[
                    styles.text,
                    { color: current.text, fontSize: currentSize.fontSize },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    text: {
        fontWeight: '600',
    },
});
