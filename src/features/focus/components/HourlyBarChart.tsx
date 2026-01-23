import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { HourlyStatsDTO } from '../../src/features/focus/application/dtos';

interface HourlyBarChartProps {
    data: HourlyStatsDTO[];
    month?: string;
    onPrevMonth?: () => void;
    onNextMonth?: () => void;
}

export const HourlyBarChart: React.FC<HourlyBarChartProps> = ({
    data,
    month = 'Dec',
    onPrevMonth,
    onNextMonth,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors);

    const maxDuration = Math.max(...data.map((d) => d.focusMinutes), 1);

    const formatDuration = (minutes: number): string => {
        if (minutes === 0) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
        }
        return `${mins}m`;
    };

    const yAxisLabels = [
        formatDuration(Math.round(maxDuration * 1.2)),
        formatDuration(Math.round(maxDuration * 0.9)),
        formatDuration(Math.round(maxDuration * 0.6)),
        formatDuration(Math.round(maxDuration * 0.3)),
        '0m',
    ];

    const xAxisLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Most Focused Time</Text>
                </View>
                <View style={styles.navigation}>
                    <TouchableOpacity onPress={onPrevMonth}>
                        <ChevronLeft size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{month}</Text>
                    <TouchableOpacity onPress={onNextMonth}>
                        <ChevronRight size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                {/* Y Axis */}
                <View style={styles.yAxis}>
                    {yAxisLabels.map((label, index) => (
                        <Text key={index} style={styles.yAxisLabel}>
                            {label}
                        </Text>
                    ))}
                </View>

                {/* Bars */}
                <View style={styles.barsContainer}>
                    {data.map((item, index) => {
                        const barHeight = (item.focusMinutes / (maxDuration * 1.2)) * 100;
                        return (
                            <View key={index} style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${Math.max(barHeight, 2)}%`,
                                            backgroundColor: colors.primary,
                                        },
                                    ]}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* X Axis */}
            <View style={styles.xAxis}>
                {xAxisLabels.map((label, index) => (
                    <Text key={index} style={styles.xAxisLabel}>
                        {label}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        navigation: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        monthText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        chartContainer: {
            flexDirection: 'row',
            height: 150,
            marginBottom: spacing.sm,
        },
        yAxis: {
            width: 40,
            justifyContent: 'space-between',
            paddingRight: spacing.sm,
        },
        yAxisLabel: {
            fontSize: 10,
            color: colors.textMuted,
            textAlign: 'right',
        },
        barsContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.xs,
        },
        barWrapper: {
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: 1,
        },
        bar: {
            width: '80%',
            borderRadius: 2,
            minHeight: 2,
        },
        xAxis: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 40,
        },
        xAxisLabel: {
            fontSize: 10,
            color: colors.textMuted,
        },
    });
