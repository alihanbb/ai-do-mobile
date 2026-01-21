import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { TimelineEntryDTO } from '../../src/features/focus/application/dtos';

interface WeeklyTimelineProps {
    data: TimelineEntryDTO[];
    weekLabel?: string;
    onPrevWeek?: () => void;
    onNextWeek?: () => void;
}

const HOURS = [0, 6, 12, 18];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_HEIGHT = 30;
const DAY_WIDTH = 40;

export const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({
    data,
    weekLabel = 'This Week',
    onPrevWeek,
    onNextWeek,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors);

    const getBlockStyle = (entry: TimelineEntryDTO) => {
        const top = (entry.startHour / 24) * (HOUR_HEIGHT * 4);
        const height = ((entry.endHour - entry.startHour) / 24) * (HOUR_HEIGHT * 4);
        const left = entry.dayOfWeek * DAY_WIDTH;

        return {
            position: 'absolute' as const,
            top,
            left: left + 5,
            width: DAY_WIDTH - 10,
            height: Math.max(height, 4),
            backgroundColor: entry.color || colors.primary,
            borderRadius: 2,
        };
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>Timeline</Text>
                </View>
                <View style={styles.navigation}>
                    <TouchableOpacity onPress={onPrevWeek}>
                        <ChevronLeft size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.weekText}>{weekLabel}</Text>
                    <TouchableOpacity onPress={onNextWeek}>
                        <ChevronRight size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                {/* Y Axis (Hours) */}
                <View style={styles.yAxis}>
                    {HOURS.map((hour) => (
                        <View key={hour} style={styles.hourRow}>
                            <Text style={styles.hourLabel}>
                                {hour.toString().padStart(2, '0')}:00
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Timeline Grid */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.gridContainer}>
                        {/* Grid Lines */}
                        {HOURS.map((hour, index) => (
                            <View
                                key={hour}
                                style={[
                                    styles.gridLine,
                                    { top: index * HOUR_HEIGHT },
                                ]}
                            />
                        ))}

                        {/* Day columns background */}
                        {DAYS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dayColumn,
                                    { left: index * DAY_WIDTH },
                                ]}
                            />
                        ))}

                        {/* Focus blocks */}
                        {data.map((entry) => (
                            <View key={entry.id} style={getBlockStyle(entry)} />
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* X Axis (Days) */}
            <View style={styles.xAxis}>
                <View style={styles.xAxisSpacer} />
                {DAYS.map((day) => (
                    <Text key={day} style={styles.dayLabel}>
                        {day}
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
        weekText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        chartContainer: {
            flexDirection: 'row',
            height: HOUR_HEIGHT * 4,
            marginBottom: spacing.sm,
        },
        yAxis: {
            width: 45,
        },
        hourRow: {
            height: HOUR_HEIGHT,
            justifyContent: 'flex-start',
        },
        hourLabel: {
            fontSize: 10,
            color: colors.textMuted,
        },
        gridContainer: {
            width: DAY_WIDTH * 7,
            height: HOUR_HEIGHT * 4,
            position: 'relative',
        },
        gridLine: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: colors.border,
        },
        dayColumn: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: DAY_WIDTH,
            borderRightWidth: 1,
            borderRightColor: colors.border,
        },
        xAxis: {
            flexDirection: 'row',
            paddingLeft: 0,
        },
        xAxisSpacer: {
            width: 45,
        },
        dayLabel: {
            width: DAY_WIDTH,
            fontSize: 10,
            color: colors.textMuted,
            textAlign: 'center',
        },
    });
