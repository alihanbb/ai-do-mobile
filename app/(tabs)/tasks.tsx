import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Platform,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Reanimated, { FadeInDown, FadeInUp, LayoutAnimationConfig } from 'react-native-reanimated';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius, gradients } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { SwipeableTaskCard } from '../../src/features/task/components/SwipeableTaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import {
    Plus,
    ListTodo,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertTriangle,
    Zap,
    Calendar,
    Filter
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

type TabType = 'pending' | 'overdue' | 'completed';

export default function TasksScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);
    const { tasks, toggleComplete, deleteTask, initialize, refresh } = useTaskStore();

    const [activeTab, setActiveTab] = useState<TabType>('pending');

    // Initial load
    useEffect(() => {
        initialize();
    }, []);

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    // Filter Logic
    const { pendingTasks, overdueTasks, completedTasks } = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const pending: typeof tasks = [];
        const overdue: typeof tasks = [];
        const completed: typeof tasks = [];

        tasks.forEach(task => {
            if (task.completed) {
                completed.push(task);
            } else if (task.dueDate) {
                let dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                if (dueDate < now) {
                    overdue.push(task);
                } else {
                    pending.push(task);
                }
            } else {
                pending.push(task);
            }
        });
        return { pendingTasks: pending, overdueTasks: overdue, completedTasks: completed };
    }, [tasks]);

    const displayedTasks = useMemo(() => {
        switch (activeTab) {
            case 'pending': return pendingTasks;
            case 'overdue': return overdueTasks;
            case 'completed': return completedTasks;
            default: return [];
        }
    }, [activeTab, pendingTasks, overdueTasks, completedTasks]);

    const completionRate = tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0;

    const handleDelete = (taskId: string, taskTitle: string) => {
        Alert.alert(
            t('tasks.deleteTask'),
            `"${taskTitle}" ${t('tasks.deleteConfirm')}`,
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.delete'), style: 'destructive', onPress: () => deleteTask(taskId) },
            ]
        );
    };

    const styles = createStyles(colors, isDark);

    // Tab configuration with icons and colors
    const tabConfig = {
        pending: { icon: Clock, color: colors.secondary, label: t('tasks.pending') },
        overdue: { icon: AlertTriangle, color: colors.error, label: t('tasks.overdue') },
        completed: { icon: CheckCircle2, color: colors.success, label: t('tasks.completed') }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Clean Header */}
                    <Reanimated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>{t('common.hello')} 👋</Text>
                            <Text style={styles.title}>{t('tasks.myTasks')}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/task/create')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.addBtnInner}>
                                <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
                            </View>
                        </TouchableOpacity>
                    </Reanimated.View>

                    {/* Quick Stats */}
                    <Reanimated.View entering={FadeInDown.delay(150).duration(600)} style={styles.quickStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.secondary }]}>{pendingTasks.length}</Text>
                            <Text style={styles.statText}>{t('tasks.pending')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: overdueTasks.length > 0 ? colors.error : colors.textMuted }]}>
                                {overdueTasks.length}
                            </Text>
                            <Text style={styles.statText}>{t('tasks.overdue')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.success }]}>{completedTasks.length}</Text>
                            <Text style={styles.statText}>{t('tasks.done')}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statNumber, { color: colors.accent }]}>{completionRate}%</Text>
                            <Text style={styles.statText}>{t('tasks.success')}</Text>
                        </View>
                    </Reanimated.View>

                    {/* Tab Switcher */}
                    <Reanimated.View entering={FadeInDown.delay(200).duration(600)} style={styles.tabsWrapper}>
                        {(['pending', 'overdue', 'completed'] as TabType[]).map((tab) => {
                            const isActive = activeTab === tab;
                            const config = tabConfig[tab];
                            const TabIcon = config.icon;

                            return (
                                <TouchableOpacity
                                    key={tab}
                                    style={[
                                        styles.tabItem,
                                        isActive && { backgroundColor: config.color + '15' }
                                    ]}
                                    onPress={() => setActiveTab(tab)}
                                    activeOpacity={0.7}
                                >
                                    <TabIcon
                                        size={18}
                                        color={isActive ? config.color : colors.textMuted}
                                    />
                                    <Text style={[
                                        styles.tabText,
                                        isActive && { color: config.color }
                                    ]}>
                                        {config.label}
                                    </Text>
                                    {isActive && (
                                        <View style={[styles.tabIndicator, { backgroundColor: config.color }]} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </Reanimated.View>

                    {/* Task List */}
                    <View style={styles.listContainer}>
                        {displayedTasks.length > 0 ? (
                            displayedTasks.map((task, index) => (
                                <Reanimated.View
                                    key={task.id}
                                    entering={FadeInUp.delay(250 + (index * 30)).duration(400)}
                                >
                                    <SwipeableTaskCard
                                        task={task}
                                        onToggleComplete={() => toggleComplete(task.id)}
                                        onDelete={() => handleDelete(task.id, task.title)}
                                        onPress={() => router.push(`/task/${task.id}`)}
                                    />
                                </Reanimated.View>
                            ))
                        ) : (
                            <Reanimated.View entering={FadeInUp.delay(300).duration(500)} style={styles.emptyContainer}>
                                <View style={[styles.emptyIcon, { backgroundColor: tabConfig[activeTab].color + '15' }]}>
                                    {activeTab === 'completed' ? (
                                        <CheckCircle2 size={32} color={colors.success} />
                                    ) : activeTab === 'overdue' ? (
                                        <AlertTriangle size={32} color={colors.error} />
                                    ) : (
                                        <ListTodo size={32} color={colors.primary} />
                                    )}
                                </View>
                                <Text style={styles.emptyTitle}>
                                    {activeTab === 'completed'
                                        ? t('tasks.noCompleted')
                                        : activeTab === 'overdue'
                                            ? t('tasks.noOverdue')
                                            : t('tasks.noPending')}
                                </Text>
                                <Text style={styles.emptyDesc}>
                                    {activeTab === 'completed'
                                        ? t('tasks.completedWillShow')
                                        : activeTab === 'overdue'
                                            ? t('tasks.allOnTime')
                                            : t('tasks.startAdding')}
                                </Text>
                                {activeTab === 'pending' && (
                                    <TouchableOpacity
                                        style={styles.emptyButton}
                                        onPress={() => router.push('/task/create')}
                                    >
                                        <Plus size={18} color="#FFF" />
                                        <Text style={styles.emptyButtonText}>{t('tasks.addTask')}</Text>
                                    </TouchableOpacity>
                                )}
                            </Reanimated.View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        safeArea: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            paddingBottom: 120,
            paddingTop: 8,
        },
        header: {
            paddingHorizontal: spacing.xl,
            paddingTop: Platform.OS === 'android' ? 48 : 12,
            marginBottom: spacing.xl,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        greeting: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 4,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: -0.3,
        },
        addButton: {
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        addBtnInner: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        // Quick Stats
        quickStats: {
            flexDirection: 'row',
            marginHorizontal: spacing.lg,
            marginBottom: spacing.xl,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        statItem: {
            flex: 1,
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 2,
        },
        statText: {
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: '500',
        },
        statDivider: {
            width: 1,
            height: 32,
            backgroundColor: colors.border,
        },
        // Tab Switcher
        tabsWrapper: {
            flexDirection: 'row',
            marginHorizontal: spacing.lg,
            marginBottom: spacing.lg,
            gap: 8,
        },
        tabItem: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: borderRadius.lg,
            gap: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
        },
        tabText: {
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: '600',
        },
        tabIndicator: {
            position: 'absolute',
            bottom: 0,
            left: '25%',
            right: '25%',
            height: 3,
            borderRadius: 2,
        },
        // List
        listContainer: {
            paddingHorizontal: spacing.lg,
        },
        // Empty State
        emptyContainer: {
            alignItems: 'center',
            paddingVertical: spacing.xxxl,
            paddingHorizontal: spacing.xl,
        },
        emptyIcon: {
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
        },
        emptyTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: spacing.sm,
            textAlign: 'center',
        },
        emptyDesc: {
            color: colors.textMuted,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: spacing.lg,
        },
        emptyButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: borderRadius.lg,
        },
        emptyButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });


