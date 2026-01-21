import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
    StatusBar,
    Alert,
    RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { useTaskStore } from '../../store/taskStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { SwipeableTaskCard } from '../../components/task/SwipeableTaskCard';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, RefreshCw, Link as LinkIcon } from 'lucide-react-native';
import { calendarApi } from '../../src/features/calendar/infrastructure/api/calendarApi';
import { CalendarEventSummaryDto, DaySummaryDto } from '../../src/features/calendar/domain/types';

interface DayData {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    date: Date;
    taskCount: number;
}

export default function CalendarScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const { t, i18n } = useTranslation();
    const colors = getColors(isDark);
    const { tasks, toggleComplete } = useTaskStore();

    // Localized days and months
    const DAYS_OF_WEEK = i18n.language === 'en'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const MONTHS = i18n.language === 'en'
        ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        : ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Remote events state
    const [calendarEvents, setCalendarEvents] = useState<CalendarEventSummaryDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Fetch events for the current month
    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            // Need to adjust month for API (1-12)
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const events = await calendarApi.getEventsByMonth(year, month);
            setCalendarEvents(events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            // Silent error or toast
        } finally {
            setIsLoading(false);
        }
    }, [currentDate]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Handle sync
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await calendarApi.syncGoogle();
            Alert.alert(t('common.success'), t('calendar.syncSuccess') || 'Calendar synced successfully');
            fetchEvents();
        } catch (error) {
            console.error('Sync failed:', error);
            Alert.alert(t('common.error'), t('calendar.syncFailed') || 'Sync failed');
        } finally {
            setIsSyncing(false);
        }
    };

    // Helper functions
    const getTaskCountForDate = (date: Date): number => {
        const localCount = tasks.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getFullYear() === date.getFullYear() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getDate() === date.getDate()
            );
        }).length;

        const remoteCount = calendarEvents.filter(event => {
            const eventDate = new Date(event.startDateTime);
            return (
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
            );
        }).length;

        return localCount + remoteCount;
    };

    const getTasksForDate = (date: Date) => {
        const dateTasks = tasks.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return (
                taskDate.getFullYear() === date.getFullYear() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getDate() === date.getDate()
            );
        });
        return dateTasks;
    };

    const getEventsForDate = (date: Date) => {
        return calendarEvents.filter(event => {
            const eventDate = new Date(event.startDateTime);
            return (
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
            );
        });
    };

    // Generate calendar days
    const calendarDays = useMemo((): DayData[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        let startDayOfWeek = firstDay.getDay() - 1;
        if (startDayOfWeek < 0) startDayOfWeek = 6;

        const days: DayData[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonth.getDate() - i;
            const date = new Date(year, month - 1, day);
            days.push({
                day,
                isCurrentMonth: false,
                isToday: false,
                date,
                taskCount: getTaskCountForDate(date),
            });
        }

        // Current month days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                day,
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
                date,
                taskCount: getTaskCountForDate(date),
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                day,
                isCurrentMonth: false,
                isToday: false,
                date,
                taskCount: getTaskCountForDate(date),
            });
        }

        return days;
    }, [currentDate, tasks, calendarEvents]);

    const navigateMonth = (direction: number) => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const handleDayPress = (dayData: DayData) => {
        setSelectedDate(dayData.date);
        setModalVisible(true);
    };

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('calendar.title')}</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw size={20} color={isSyncing ? colors.textMuted : colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/task/create')}
                    >
                        <Plus size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Month Navigation */}
            <View style={styles.monthNav}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigateMonth(-1)}
                >
                    <ChevronLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigateMonth(1)}
                >
                    <ChevronRight size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Days of Week Header */}
            <View style={styles.weekHeader}>
                {DAYS_OF_WEEK.map((day) => (
                    <Text key={day} style={styles.weekDay}>
                        {day}
                    </Text>
                ))}
            </View>

            <ScrollView
                contentContainerStyle={styles.calendarGrid}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchEvents} />
                }
            >
                {calendarDays.map((dayData, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayCell,
                            dayData.isToday && styles.todayCell,
                            !dayData.isCurrentMonth && styles.otherMonthCell,
                        ]}
                        onPress={() => handleDayPress(dayData)}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                dayData.isToday && styles.todayText,
                                !dayData.isCurrentMonth && styles.otherMonthText,
                            ]}
                        >
                            {dayData.day}
                        </Text>
                        {dayData.taskCount > 0 && (
                            <View style={styles.taskDots}>
                                {Array.from({ length: Math.min(dayData.taskCount, 3) }).map(
                                    (_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.taskDot,
                                                i === 1 && { backgroundColor: colors.secondary },
                                                i === 2 && { backgroundColor: colors.accent },
                                            ]}
                                        />
                                    )
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Day Tasks Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <CalendarIcon size={20} color={colors.primary} />
                                <Text style={styles.modalTitle}>
                                    {selectedDate?.toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeText}>{t('common.close')}</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            {selectedDateTasks.length === 0 && selectedDateEvents.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <CalendarIcon size={48} color={colors.textMuted} />
                                    <Text style={styles.emptyTitle}>{t('tasks.noTasks')}</Text>
                                    <Text style={styles.emptyText}>
                                        {t('calendar.noEvents')}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.addTaskButton}
                                        onPress={() => {
                                            setModalVisible(false);
                                            router.push('/task/create');
                                        }}
                                    >
                                        <Plus size={18} color={colors.textPrimary} />
                                        <Text style={styles.addTaskText}>{t('tasks.addTask') || 'Görev Ekle'}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    {/* Remote Events */}
                                    {selectedDateEvents.length > 0 && (
                                        <View style={styles.sectionContainer}>
                                            <Text style={styles.sectionTitle}>
                                                {t('calendar.events') || 'Events'}
                                            </Text>
                                            {selectedDateEvents.map(event => (
                                                <View key={event.id} style={styles.eventCard}>
                                                    <View style={[styles.eventColorStrip, { backgroundColor: event.color || colors.secondary }]} />
                                                    <View style={styles.eventContent}>
                                                        <Text style={styles.eventTitle}>{event.title}</Text>
                                                        <Text style={styles.eventTime}>
                                                            {event.isAllDay
                                                                ? (t('calendar.allDay') || 'All Day')
                                                                : `${new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    {/* Local Tasks */}
                                    {selectedDateTasks.length > 0 && (
                                        <View style={styles.sectionContainer}>
                                            <Text style={styles.sectionTitle}>
                                                {t('calendar.tasks') || 'Tasks'}
                                            </Text>
                                            {selectedDateTasks.map((task) => (
                                                <SwipeableTaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onPress={() => {
                                                        setModalVisible(false);
                                                        router.push(`/task/${task.id}`);
                                                    }}
                                                    onToggleComplete={() => toggleComplete(task.id)}
                                                    onDelete={() => {
                                                        // Handle delete if needed or pass a dummy function if it's optional
                                                        // Assuming delete integration isn't primary here or passed from parent store
                                                    }}
                                                />
                                            ))}
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
            paddingTop: Platform.OS === 'android' ? spacing.lg + (StatusBar.currentHeight || 24) : spacing.lg,
            paddingBottom: spacing.md,
        },
        headerButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 'bold',
        },
        addButton: {
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        actionButton: {
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
        },
        monthNav: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
        },
        navButton: {
            width: 40,
            height: 40,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        monthText: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        weekHeader: {
            flexDirection: 'row',
            paddingHorizontal: spacing.sm,
            marginBottom: spacing.sm,
        },
        weekDay: {
            flex: 1,
            textAlign: 'center',
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: '600',
        },
        calendarGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: spacing.sm,
        },
        dayCell: {
            width: '14.28%',
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.xs,
        },
        todayCell: {
            backgroundColor: colors.primary + '20',
            borderRadius: borderRadius.md,
        },
        otherMonthCell: {
            opacity: 0.3,
        },
        dayText: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '500',
        },
        todayText: {
            color: colors.primary,
            fontWeight: 'bold',
        },
        otherMonthText: {
            color: colors.textMuted,
        },
        taskDots: {
            flexDirection: 'row',
            gap: 2,
            marginTop: 4,
        },
        taskDot: {
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: colors.primary,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.surfaceSolid,
            borderTopLeftRadius: borderRadius.xxl,
            borderTopRightRadius: borderRadius.xxl,
            maxHeight: '70%',
            paddingBottom: spacing.xxl,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        modalTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        modalTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        closeButton: {
            padding: spacing.sm,
        },
        closeText: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '500',
        },
        modalScroll: {
            padding: spacing.lg,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: spacing.xxxl,
        },
        emptyTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            marginTop: spacing.md,
        },
        emptyText: {
            color: colors.textMuted,
            fontSize: 14,
            marginTop: spacing.xs,
            textAlign: 'center',
        },
        addTaskButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.md,
            marginTop: spacing.xl,
        },
        addTaskText: {
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: '600',
        },
        sectionContainer: {
            marginBottom: spacing.lg,
        },
        sectionTitle: {
            color: colors.textMuted,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        eventCard: {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            marginBottom: spacing.sm,
            flexDirection: 'row',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },
        eventColorStrip: {
            width: 4,
            backgroundColor: colors.secondary,
        },
        eventContent: {
            padding: spacing.md,
            flex: 1,
        },
        eventTitle: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4,
        },
        eventTime: {
            color: colors.textMuted,
            fontSize: 14,
        }
    });
