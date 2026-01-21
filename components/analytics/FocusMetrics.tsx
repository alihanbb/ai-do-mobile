import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { LucideIcon } from 'lucide-react-native';

interface FocusMetric {
    icon: LucideIcon;
    value: string;
    label: string;
    iconColor?: string;
}

interface FocusMetricsProps {
    metrics: FocusMetric[];
    title?: string;
}

export const FocusMetrics = React.memo(function FocusMetrics({
    metrics,
    title = 'Odak'
}: FocusMetricsProps) {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
            <View style={styles.container}>
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                { backgroundColor: colors.surfaceSolid, borderColor: colors.border }
                            ]}
                        >
                            <Icon
                                size={28}
                                color={metric.iconColor || colors.primary}
                            />
                            <Text style={[styles.label, { color: colors.textMuted }]}>
                                {metric.label}
                            </Text>
                            <Text style={[styles.value, { color: colors.textPrimary }]}>
                                {metric.value}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    card: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        gap: spacing.sm,
    },
    label: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
    },
});
