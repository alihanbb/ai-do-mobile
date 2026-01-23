import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { AnalyticsTabs } from '../../components/analytics/AnalyticsTabs';
import { HeroStatCard } from '../../components/analytics/HeroStatCard';
import { UsageBreakdown } from '../../components/analytics/UsageBreakdown';
import { FocusMetrics } from '../../components/analytics/FocusMetrics';
import { PeakHours } from '../../components/analytics/PeakHours';
import { TopCategories } from '../../components/analytics/TopCategories';
import { InsightCard } from '../../components/analytics/InsightCard';
import { StreakCard } from '../../components/analytics/StreakCard';
import { Settings, Target, Timer, ChevronLeft } from 'lucide-react-native';
import { TaskCategory } from '../../types/task';
import { analyticsApi, AnalyticsResponse, StreaksResponse, PeakHoursResponse } from '../../src/features/analytics/infrastructure/api/analyticsApi';
import { useFocusStore } from 'expo-router/build/global-state/router-store';
import { useFocusEffect } from '@react-navigation/native'; // Ensure using proper focus effect

type TabOption = 'day' | 'week' | 'trend';

export default function AnalyticsScreen() {
    const { isDark } = useThemeStore();
    const { t, i18n } = useTranslation();
    const colors = getColors(isDark);
    const { tasks } = useTaskStore();

    const [activeTab, setActiveTab] = useState<TabOption>('day');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // API Data States
    const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
    const [streaksData, setStreaksData] = useState<StreaksResponse | null>(null);
    const [peakHoursData, setPeakHoursData] = useState<PeakHoursResponse | null>(null);

    // Fetch analytics data from backend
    const fetchAnalytics = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const period = activeTab === 'trend' ? 'month' : activeTab;
            console.log('Fetching analytics for period:', period);

            const [analytics, streaks, peakHours] = await Promise.all([
                analyticsApi.getAnalytics(period),
                analyticsApi.getStreaks(),
                analyticsApi.getPeakHours(activeTab === 'day' ? 'week' : 'week')
            ]);

            setAnalyticsData(analytics);
            setStreaksData(streaks);
            setPeakHoursData(peakHours);
        } catch (err: any) {
            console.error('Failed to fetch analytics:', err);
            // Don't show error to user immediately, just log it. 
            // The charts will render fallback/empty states.
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    // Refetch when tab comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchAnalytics();
        }, [fetchAnalytics])
    );

    // Local fallback calculations when API fails
    const completedTasks = analyticsData?.tasksCompleted ?? tasks.filter((t) => t.completed).length;
    const totalTasks = (analyticsData?.tasksCreated ?? 0) + (analyticsData?.tasksCompleted ?? 0) || tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Usage breakdown data
    const usageData = useMemo(() => {
        const completed = analyticsData?.tasksCompleted ?? tasks.filter(t => t.completed).length;
        const pending = (analyticsData?.tasksCreated ?? tasks.filter(t => !t.completed).length) - completed;
        const total = (completed + Math.max(0, pending)) || 1;

        return [
            { label: t('tasks.completed'), percent: Math.round((completed / total) * 100), color: colors.success },
            { label: t('tasks.pending'), percent: Math.round((Math.max(0, pending) / total) * 100), color: colors.secondary },
            { label: t('tasks.overdue'), percent: 0, color: colors.error },
        ];
    }, [analyticsData, tasks, colors, t]);

    // Peak hours from API or generate from hourlyActivity
    const peakHoursActivityData = useMemo(() => {
        if (peakHoursData?.hourlyActivity) {
            const hours = new Array(24).fill(0);
            Object.entries(peakHoursData.hourlyActivity).forEach(([hour, count]) => {
                const hourNum = parseInt(hour, 10);
                if (!isNaN(hourNum) && hourNum >= 0 && hourNum < 24) {
                    hours[hourNum] = count;
                }
            });
            return hours;
        }
        // Fallback mock data if completely empty, so charts don't crash
        return new Array(24).fill(0);
    }, [peakHoursData]);

    // Top categories from local data (backend doesn't have category breakdown yet)
    const topCategories = useMemo(() => {
        const categoryMap = new Map<TaskCategory, number>();
        tasks.filter(t => t.completed).forEach((task) => {
            if (task.category) {
                categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
            }
        });
        return Array.from(categoryMap.entries())
            .map(([category, count]) => ({ category, label: category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [tasks]);

    // Focus metrics from API
    const focusMetrics = useMemo(() => {
        const focusMins = analyticsData?.focusMinutes ?? 0;
        const focusHours = Math.floor(focusMins / 60);
        const focusMinsRemainder = focusMins % 60;
        const focusDisplay = focusHours > 0
            ? `${focusHours}h ${focusMinsRemainder}m`
            : `${focusMins}m`;

        return [
            { icon: Target, value: focusDisplay, label: i18n.language === 'en' ? 'TOTAL FOCUS' : 'TOPLAM ODAK', iconColor: colors.primary },
            { icon: Timer, value: `${streaksData?.currentStreak ?? 0}d`, label: i18n.language === 'en' ? 'CURRENT STREAK' : 'GÜNCEL SERİ', iconColor: colors.secondary },
        ];
    }, [analyticsData, streaksData, i18n.language, colors]);

    // Streak from API or local calculation
    const { currentStreak, longestStreak, todayCompleted } = useMemo(() => {
        if (streaksData) {
            return {
                currentStreak: streaksData.currentStreak,
                longestStreak: streaksData.longestStreak,
                todayCompleted: streaksData.completedToday
            };
        }

        // Local fallback calculation if API fails
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCompletedLocal = tasks.some((task) => {
            if (!task.completed || !task.updatedAt) return false;
            const completedDate = new Date(task.updatedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
        });

        return { currentStreak: todayCompletedLocal ? 1 : 0, longestStreak: 1, todayCompleted: todayCompletedLocal };
    }, [streaksData, tasks]);

    const styles = createStyles(colors);

    const renderDayView = () => (
        <>
            {/* Date Navigation */}
            <View style={styles.dateNav}>
                <TouchableOpacity style={styles.dateNavButton}>
                    <ChevronLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.dateTitle}>{t('time.today').toUpperCase()}</Text>
                <View style={styles.dateNavButton} />
            </View>

            {/* Streak Card */}
            <View style={{ paddingHorizontal: spacing.lg }}>
                <StreakCard
                    currentStreak={currentStreak}
                    longestStreak={longestStreak}
                    todayCompleted={todayCompleted}
                />
            </View>

            {/* Peak Hours */}
            <PeakHours peakTime={peakHoursData?.peakTimeRange ?? "00:00 - 00:00"} data={peakHoursActivityData} />

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title={t('analytics.taskStatus')} />

            {/* Focus Metrics */}
            <FocusMetrics metrics={focusMetrics} title={t('pomo.focus')} />

            {/* Insight */}
            <InsightCard
                title={t('analytics.productivityTip')}
                description={t('analytics.morningTip')}
                type="positive"
            />
        </>
    );

    const renderWeekView = () => (
        <>
            {/* Date Navigation */}
            <View style={styles.dateNav}>
                <TouchableOpacity style={styles.dateNavButton}>
                    <ChevronLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.dateTitle}>{t('analytics.thisWeek').toUpperCase()}</Text>
                <View style={styles.dateNavButton} />
            </View>

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title={t('analytics.weeklyTaskStatus')} />

            {/* Top Categories */}
            <TopCategories categories={topCategories} title={t('analytics.topCategories')} />

            {/* Focus Metrics */}
            <FocusMetrics metrics={focusMetrics} title={t('analytics.weeklyFocus')} />

            {/* Insight */}
            <InsightCard
                title={t('analytics.weeklySummary')}
                description={t('analytics.weeklySummaryDesc', { count: completedTasks })}
                type={completedTasks > 5 ? 'positive' : 'neutral'}
            />
        </>
    );

    const renderTrendView = () => (
        <>
            {/* Date Navigation */}
            <View style={styles.dateNav}>
                <Text style={styles.dateTitle}>{t('analytics.lastMonth').toUpperCase()}</Text>
            </View>

            {/* Hero Stat */}
            <HeroStatCard
                value={`${completedTasks > 0 ? '+' : ''}${completedTasks}`}
                label={t('analytics.thisPeriod').toUpperCase()}
                changePercent={completionRate}
                changeLabel={t('analytics.completion')}
                isPositive={completedTasks > 0}
            />

            {/* Top Categories */}
            <TopCategories categories={topCategories} title={t('analytics.topCategories')} />

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title={t('analytics.monthlyStatus')} />

            <InsightCard
                title={completionRate >= 50 ? t('analytics.greatJob') : t('analytics.improvementArea')}
                description={completionRate >= 50
                    ? t('analytics.greatJobDesc', { rate: completionRate })
                    : t('analytics.improvementAreaDesc')}
                type={completionRate >= 50 ? 'positive' : 'neutral'}
            />
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Settings size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('analytics.title')}</Text>
                <View style={styles.headerDots}>
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                    <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
                </View>
            </View>

            {/* Tabs */}
            <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchAnalytics} />
                }
            >
                {activeTab === 'day' && renderDayView()}
                {activeTab === 'week' && renderWeekView()}
                {activeTab === 'trend' && renderTrendView()}
            </ScrollView>
        </SafeAreaView>
    );
}

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
            paddingHorizontal: spacing.lg,
            paddingTop: Platform.OS === 'android' ? spacing.md + (StatusBar.currentHeight || 24) : spacing.md,
            paddingBottom: spacing.md,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        headerDots: {
            flexDirection: 'row',
            gap: 4,
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            paddingBottom: spacing.xxxl,
        },
        dateNav: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: spacing.md,
            gap: spacing.lg,
        },
        dateNavButton: {
            width: 32,
            height: 32,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surfaceSolid,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateTitle: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '600',
            letterSpacing: 1,
        },
    });
