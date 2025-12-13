import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { FocusStats } from '../../types/pomo';

interface StatsModalProps {
    visible: boolean;
    onClose: () => void;
    stats: FocusStats;
}

type TimeRange = 'Day' | 'Week' | 'Month' | 'Custom';
type TrendRange = 'Week' | 'Month' | 'Year';

export const StatsModal: React.FC<StatsModalProps> = ({
    visible,
    onClose,
    stats,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const [timeRange, setTimeRange] = useState<TimeRange>('Day');
    const [trendRange, setTrendRange] = useState<TrendRange>('Week');

    const styles = createStyles(colors);

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
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Focus Statistics</Text>
                    <TouchableOpacity>
                        <ExternalLink size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.body}>
                    {/* Summary Cards */}
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Today's Pomo</Text>
                            <Text style={styles.summarySubLabel}>
                                0 from yesterday <Text style={styles.upArrow}>↑</Text>
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.primary }]}>
                                {stats.todayPomoCount ?? 0}
                            </Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Today's Focus (h)</Text>
                            <Text style={styles.summarySubLabel}>
                                0h0m from yesterday <Text style={styles.upArrow}>↑</Text>
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                                {Math.floor((stats.todayFocusDuration ?? 0) / 60)}
                                <Text style={styles.summaryUnit}>h </Text>
                                {(stats.todayFocusDuration ?? 0) % 60}
                                <Text style={styles.summaryUnit}>m</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Pomo</Text>
                            <Text style={[styles.summaryValue, { color: colors.primary }]}>
                                {stats.totalPomoCount ?? 0}
                            </Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Focus Duration</Text>
                            <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                                {Math.floor((stats.totalFocusDuration ?? 0) / 60)}
                                <Text style={styles.summaryUnit}>h </Text>
                                {(stats.totalFocusDuration ?? 0) % 60}
                                <Text style={styles.summaryUnit}>m</Text>
                            </Text>
                        </View>
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
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
        },
        summaryLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
        },
        summarySubLabel: {
            fontSize: 11,
            color: colors.textMuted,
            marginBottom: spacing.sm,
        },
        upArrow: {
            color: colors.success,
        },
        summaryValue: {
            fontSize: 28,
            fontWeight: 'bold',
        },
        summaryUnit: {
            fontSize: 16,
            fontWeight: 'normal',
        },
        section: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.md,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        addButton: {
            fontSize: 24,
            color: colors.primary,
        },
        dateNav: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        dateText: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        tabRow: {
            flexDirection: 'row',
            gap: spacing.sm,
            marginBottom: spacing.lg,
        },
        tab: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
            backgroundColor: 'transparent',
        },
        tabActive: {
            backgroundColor: colors.primary + '20',
        },
        tabText: {
            fontSize: 14,
            color: colors.textMuted,
        },
        tabTextActive: {
            color: colors.primary,
            fontWeight: '600',
        },
        chartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
        },
        chartCenter: {
            position: 'absolute',
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
        },
    });
