import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
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
import { Settings, Target, Timer, Bell, Smartphone, ChevronLeft } from 'lucide-react-native';
import { TaskCategory } from '../../types/task';

type TabOption = 'day' | 'week' | 'trend';

export default function AnalyticsScreen() {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { tasks } = useTaskStore();

    const [activeTab, setActiveTab] = useState<TabOption>('day');

    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Usage breakdown data
    const usageData = useMemo(() => {
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.filter(t => !t.completed).length;
        const total = tasks.length || 1;

        return [
            { label: 'Tamamlanan', percent: Math.round((completed / total) * 100), color: colors.success },
            { label: 'Bekleyen', percent: Math.round((pending / total) * 100), color: colors.warning },
            { label: 'Geciken', percent: 0, color: colors.error },
        ];
    }, [tasks, colors]);

    // Peak hours - mock data (would be calculated from task completion times)
    const peakHoursData = useMemo(() => {
        const hours = new Array(24).fill(0);
        // Mock peak activity around 10-11 AM and 2-4 PM
        hours[9] = 2;
        hours[10] = 5;
        hours[11] = 3;
        hours[14] = 4;
        hours[15] = 6;
        hours[16] = 3;
        return hours;
    }, []);

    // Top categories
    const topCategories = useMemo(() => {
        const categoryMap = new Map<TaskCategory, number>();

        tasks.filter(t => t.completed).forEach((task) => {
            if (task.category) {
                categoryMap.set(task.category, (categoryMap.get(task.category) || 0) + 1);
            }
        });

        return Array.from(categoryMap.entries())
            .map(([category, count]) => ({
                category,
                label: category,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [tasks]);

    // Focus metrics
    const focusMetrics = [
        { icon: Target, value: '2s 35d', label: 'EN UZUN ODAK', iconColor: colors.primary },
        { icon: Timer, value: '16d', label: 'KESİNTİSİZ', iconColor: colors.secondary },
    ];

    // Streak calculation
    const { currentStreak, longestStreak, todayCompleted } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayCompleted = tasks.some((task) => {
            if (!task.completed || !task.updatedAt) return false;
            const completedDate = new Date(task.updatedAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
        });

        let current = todayCompleted ? 1 : 0;
        let checkDate = new Date(today);

        for (let i = 1; i < 365; i++) {
            checkDate.setDate(checkDate.getDate() - 1);
            const hasCompleted = tasks.some((task) => {
                if (!task.completed || !task.updatedAt) return false;
                const completedDate = new Date(task.updatedAt);
                completedDate.setHours(0, 0, 0, 0);
                return completedDate.getTime() === checkDate.getTime();
            });

            if (hasCompleted) current++;
            else break;
        }

        return { currentStreak: current, longestStreak: Math.max(current, 7), todayCompleted };
    }, [tasks]);

    const styles = createStyles(colors);

    const renderDayView = () => (
        <>
            {/* Date Navigation */}
            <View style={styles.dateNav}>
                <TouchableOpacity style={styles.dateNavButton}>
                    <ChevronLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.dateTitle}>BUGÜN</Text>
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
            <PeakHours peakTime="10:00 - 11:00" data={peakHoursData} />

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title="Görev Durumu" />

            {/* Focus Metrics */}
            <FocusMetrics metrics={focusMetrics} title="Odak" />

            {/* Insight */}
            <InsightCard
                title="Verimlilik ipucu"
                description="Sabah saatlerinde daha verimlisin. Zor görevleri bu saatlere planlamayı dene."
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
                <Text style={styles.dateTitle}>BU HAFTA</Text>
                <View style={styles.dateNavButton} />
            </View>

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title="Haftalık Görev Durumu" />

            {/* Top Categories */}
            <TopCategories categories={topCategories} title="En çok tamamlanan kategoriler" />

            {/* Focus Metrics */}
            <FocusMetrics metrics={focusMetrics} title="Haftalık Odak" />

            {/* Insight */}
            <InsightCard
                title="Haftalık özet"
                description={`Bu hafta ${completedTasks} görev tamamladın. Tebrikler!`}
                type={completedTasks > 5 ? 'positive' : 'neutral'}
            />
        </>
    );

    const renderTrendView = () => (
        <>
            {/* Date Navigation */}
            <View style={styles.dateNav}>
                <Text style={styles.dateTitle}>SON 1 AY</Text>
            </View>

            {/* Hero Stat */}
            <HeroStatCard
                value={`${completedTasks > 0 ? '+' : ''}${completedTasks}`}
                label="BU DÖNEMDE"
                changePercent={completionRate}
                changeLabel="tamamlanma"
                isPositive={completedTasks > 0}
            />

            {/* Top Categories */}
            <TopCategories categories={topCategories} title="En çok tamamlanan kategoriler" />

            {/* Usage Breakdown */}
            <UsageBreakdown data={usageData} title="Aylık Durum" />

            {/* Insight */}
            <InsightCard
                title={completionRate >= 50 ? "Harika gidiyorsun!" : "Gelişim alanı"}
                description={completionRate >= 50
                    ? `Görevlerinin %${completionRate}'sini tamamladın. Bu başarını korumaya devam et!`
                    : "Daha fazla görev tamamlayarak verimliliğini artırabilirsin."}
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
                <Text style={styles.title}>Analitikler</Text>
                <View style={styles.headerDots}>
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                </View>
            </View>

            {/* Tabs */}
            <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
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
