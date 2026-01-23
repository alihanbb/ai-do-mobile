import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    iconColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    iconColor,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, iconColor && { backgroundColor: iconColor + '15' }]}>
                <Icon size={48} color={iconColor || colors.textMuted} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {actionLabel && onAction && (
                <TouchableOpacity style={styles.button} onPress={onAction}>
                    <Text style={styles.buttonText}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingVertical: spacing.xxxl,
            paddingHorizontal: spacing.lg,
        },
        iconContainer: {
            width: 96,
            height: 96,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surfaceSolid,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: spacing.sm,
        },
        description: {
            color: colors.textMuted,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
            maxWidth: 280,
        },
        button: {
            marginTop: spacing.xl,
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
        },
        buttonText: {
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: '600',
        },
    });
