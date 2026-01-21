import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';

interface WeeklyChartProps {
    data: { day: string; completed: number; total: number }[];
}

export const WeeklyChart = React.memo(function WeeklyChart({ data }: WeeklyChartProps) {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const maxValue = Math.max(...data.map((d) => d.total), 1);

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Haftalık Özet</Text>
            <View style={styles.chart}>
                {data.map((item, index) => {
                    const totalHeight = (item.total / maxValue) * 100;
                    const completedHeight = item.total > 0
                        ? (item.completed / item.total) * totalHeight
                        : 0;

                    return (
                        <View key={index} style={styles.barContainer}>
                            <View style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.barBackground,
                                        { height: `${totalHeight}%` },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.barFill,
                                            { height: `${completedHeight}%` },
                                        ]}
                                    />
                                </View>
                            </View>
                            <Text style={styles.dayLabel}>{item.day}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                    <Text style={styles.legendText}>Tamamlanan</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
                    <Text style={styles.legendText}>Toplam</Text>
                </View>
            </View>
        </View>
    );
});

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            marginBottom: spacing.lg,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: spacing.lg,
        },
        chart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 120,
            marginBottom: spacing.md,
        },
        barContainer: {
            flex: 1,
            alignItems: 'center',
        },
        barWrapper: {
            flex: 1,
            width: '60%',
            justifyContent: 'flex-end',
        },
        barBackground: {
            width: '100%',
            backgroundColor: colors.border,
            borderRadius: borderRadius.sm,
            justifyContent: 'flex-end',
            overflow: 'hidden',
        },
        barFill: {
            width: '100%',
            backgroundColor: colors.primary,
            borderRadius: borderRadius.sm,
        },
        dayLabel: {
            color: colors.textMuted,
            fontSize: 11,
            marginTop: spacing.xs,
        },
        legend: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.lg,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        legendDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        legendText: {
            color: colors.textMuted,
            fontSize: 12,
        },
    });
