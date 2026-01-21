import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { X, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { FocusStatsDTO, HourlyStatsDTO, TimelineEntryDTO } from '../../src/features/focus/application/dtos';
import { HourlyBarChart } from './HourlyBarChart';
import { WeeklyTimeline } from './WeeklyTimeline';

interface StatsModalProps {
    visible: boolean;
    onClose: () => void;
    stats: FocusStatsDTO;
    hourlyData?: HourlyStatsDTO[];
    timelineData?: TimelineEntryDTO[];
}

type TimeRange = 'Day' | 'Week' | 'Month' | 'Custom';
type TrendRange = 'Week' | 'Month' | 'Year';

export const StatsModal: React.FC<StatsModalProps> = ({
    visible,
    onClose,
    stats,
    hourlyData = [],
    timelineData = [],
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const [timeRange, setTimeRange] = useState<TimeRange>('Day');
    const [trendRange, setTrendRange] = useState<TrendRange>('Week');

    const styles = createStyles(colors);

    const generateSampleHourlyData = (): HourlyStatsDTO[] => {
        const data: HourlyStatsDTO[] = [];
        for (let hour = 0; hour < 24; hour++) {
            let duration = 0;
            if (hour >= 8 && hour <= 12) {
                duration = Math.floor(Math.random() * 60) + 20;
            } else if (hour >= 14 && hour <= 18) {
                duration = Math.floor(Math.random() * 80) + 30;
            } else if (hour >= 20 && hour <= 22) {
                duration = Math.floor(Math.random() * 40) + 10;
            }
            data.push({ hour, focusMinutes: duration });
        }
        return data;
    };

    const generateSampleTimelineData = (): TimelineEntryDTO[] => {
        const entries: TimelineEntryDTO[] = [];
        const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

        for (let day = 0; day < 7; day++) {
            if (Math.random() > 0.3) {
                const startHour = 8 + Math.floor(Math.random() * 4);
                const duration = 1 + Math.random() * 2;
                entries.push({
                    id: `sample-${day}-1`,
                    dayOfWeek: day,
                    startHour,
                    endHour: startHour + duration,
                    durationMinutes: duration * 60,
                    presetName: 'Sample',
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
            if (Math.random() > 0.5) {
                const startHour = 14 + Math.floor(Math.random() * 4);
                const duration = 0.5 + Math.random() * 1.5;
                entries.push({
                    id: `sample-${day}-2`,
                    dayOfWeek: day,
                    startHour,
                    endHour: startHour + duration,
                    durationMinutes: duration * 60,
                    presetName: 'Sample',
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        }
        return entries;
    };

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Focus Statistics</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.body}>
                    {/* Summary Cards with Gradients */}
                    <View style={styles.summaryRow}>
                        <LinearGradient
                            colors={[colors.primaryDark, colors.primary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.summaryLabelWhite}>Today's Pomo</Text>
                                <TrendingUp size={16} color="rgba(255,255,255,0.7)" />
                            </View>
                            <Text style={styles.summarySubLabelWhite}>
                                0 from yesterday
                            </Text>
                            <Text style={styles.summaryValueWhite}>
                                {stats.todayPomoCount ?? 0}
                            </Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={[colors.secondaryDark, colors.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.summaryLabelWhite}>Today's Focus</Text>
                                <TrendingUp size={16} color="rgba(255,255,255,0.7)" />
                            </View>
                            <Text style={styles.summarySubLabelWhite}>
                                0h0m from yesterday
                            </Text>
                            <Text style={styles.summaryValueWhite}>
                                {Math.floor((stats.todayFocusMinutes ?? 0) / 60)}
                                <Text style={styles.summaryUnitWhite}>h </Text>
                                {(stats.todayFocusMinutes ?? 0) % 60}
                                <Text style={styles.summaryUnitWhite}>m</Text>
                            </Text>
                        </LinearGradient>
                    </View>

                    <View style={styles.summaryRow}>
                        <LinearGradient
                            colors={[colors.accentDark, colors.accent]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.summaryLabelWhite}>Total Pomo</Text>
                            </View>
                            <Text style={styles.summaryValueWhite}>
                                {stats.totalPomoCount ?? 0}
                            </Text>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#d97706', '#f59e0b']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.summaryCard}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.summaryLabelWhite}>Total Focus</Text>
                            </View>
                            <Text style={styles.summaryValueWhite}>
                                {Math.floor((stats.totalFocusMinutes ?? 0) / 60)}
                                <Text style={styles.summaryUnitWhite}>h </Text>
                                {(stats.totalFocusMinutes ?? 0) % 60}
                                <Text style={styles.summaryUnitWhite}>m</Text>
                            </Text>
                        </LinearGradient>
                    </View>

                    {/* Focus Record */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Focus Record</Text>
                            <TouchableOpacity>
                                <Text style={styles.addButton}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Details Chart */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Details</Text>
                            <View style={styles.dateNav}>
                                <ChevronLeft size={18} color={colors.textSecondary} />
                                <Text style={styles.dateText}>Today</Text>
                                <ChevronRight size={18} color={colors.textSecondary} />
                            </View>
                        </View>

                        {/* Time Range Tabs */}
                        <View style={styles.tabRow}>
                            {(['Day', 'Week', 'Month', 'Custom'] as TimeRange[]).map((range) => (
                                <TouchableOpacity
                                    key={range}
                                    style={[
                                        styles.tab,
                                        timeRange === range && styles.tabActive,
                                    ]}
                                    onPress={() => setTimeRange(range)}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            timeRange === range && styles.tabTextActive,
                                        ]}
                                    >
                                        {range}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Empty Chart */}
                        <View style={styles.chartContainer}>
                            <Svg width={160} height={160} viewBox="0 0 160 160">
                                <Circle
                                    cx={80}
                                    cy={80}
                                    r={70}
                                    stroke={colors.border}
                                    strokeWidth={12}
                                    fill="transparent"
                                />
                            </Svg>
                            <View style={styles.chartCenter}>
                                <Text style={styles.noDataText}>No Data</Text>
                            </View>
                        </View>
                    </View>

                    {/* Focus Ranking */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Focus Ranking</Text>
                            <TouchableOpacity style={styles.listButton}>
                                <Text style={styles.listButtonText}>List</Text>
                                <ChevronRight size={14} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.noneText}>None</Text>
                    </View>

                    {/* Trends */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Trends</Text>
                            <View style={styles.dateNav}>
                                <ChevronLeft size={18} color={colors.textSecondary} />
                                <Text style={styles.dateText}>This Week</Text>
                                <ChevronRight size={18} color={colors.textSecondary} />
                            </View>
                        </View>

                        <View style={styles.tabRow}>
                            {(['Week', 'Month', 'Year'] as TrendRange[]).map((range) => (
                                <TouchableOpacity
                                    key={range}
                                    style={[
                                        styles.tab,
                                        trendRange === range && styles.tabActive,
                                    ]}
                                    onPress={() => setTrendRange(range)}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            trendRange === range && styles.tabTextActive,
                                        ]}
                                    >
                                        {range}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Weekly Timeline */}
                    <WeeklyTimeline
                        data={timelineData.length > 0 ? timelineData : generateSampleTimelineData()}
                    />

                    {/* Hourly Bar Chart */}
                    <HourlyBarChart
                        data={hourlyData.length > 0 ? hourlyData : generateSampleHourlyData()}
                    />
                </ScrollView>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            paddingTop: spacing.xxl,
            backgroundColor: colors.background,
        },
        closeButton: {
            padding: 4,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        body: {
            flex: 1,
            padding: spacing.lg,
        },
        summaryRow: {
            flexDirection: 'row',
            gap: spacing.md,
            marginBottom: spacing.md,
        },
        summaryCard: {
            flex: 1,
            borderRadius: borderRadius.xl,
            padding: spacing.md,
            minHeight: 110,
            justifyContent: 'space-between',
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 4 },
            // shadowOpacity: 0.15,
            // shadowRadius: 8,
            // elevation: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        summaryLabelWhite: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '600',
        },
        summarySubLabelWhite: {
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 4,
        },
        summaryValueWhite: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#fff',
        },
        summaryUnitWhite: {
            fontSize: 16,
            fontWeight: '500',
            color: 'rgba(255,255,255,0.9)',
        },
        section: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            marginBottom: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.05,
            // shadowRadius: 4,
            // elevation: 2,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.textPrimary,
        },
        addButtonContainer: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary + '15',
            alignItems: 'center',
            justifyContent: 'center',
        },
        addButton: {
            fontSize: 24,
            color: colors.primary,
            fontWeight: '600',
            marginTop: -2,
        },
        dateNav: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.background,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        dateText: {
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        tabRow: {
            flexDirection: 'row',
            gap: spacing.xs,
            marginBottom: spacing.lg,
            backgroundColor: colors.background,
            padding: 4,
            borderRadius: 16,
        },
        tab: {
            flex: 1,
            paddingVertical: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
        },
        tabActive: {
            backgroundColor: colors.surface,
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 0.1,
            // shadowRadius: 2,
            // elevation: 1,
        },
        tabText: {
            fontSize: 13,
            color: colors.textMuted,
            fontWeight: '500',
        },
        tabTextActive: {
            color: colors.textPrimary,
            fontWeight: '700',
        },
        chartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            position: 'relative',
        },
        chartCenter: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        chartCenterValue: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        chartCenterLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: -4,
        },
        noDataText: {
            fontSize: 16,
            color: colors.textMuted,
        },
        listButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        listButtonText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        noneText: {
            fontSize: 14,
            color: colors.textMuted,
            fontStyle: 'italic',
            textAlign: 'center',
            paddingVertical: 12,
        },
    });
