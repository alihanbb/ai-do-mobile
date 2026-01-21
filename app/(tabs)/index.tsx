import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius, gradients } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { SwipeableTaskCard } from '../../components/task/SwipeableTaskCard';
import { AISuggestionCard } from '../../components/ai/AISuggestionCard';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, Mic, CheckCircle2, Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const { t, i18n } = useTranslation();
    const colors = getColors(isDark);
    const { tasks, suggestions, toggleComplete, dismissSuggestion, deleteTask } = useTaskStore();
    const { user } = useAuthStore();

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const pendingTasks = tasks.filter((t) => {
        if (t.completed) return false;
        if (!t.dueDate) return false;
        return isSameDay(new Date(t.dueDate), new Date());
    });
    const activeSuggestions = suggestions.filter((s) => !s.dismissed);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('home.greeting.morning');
        if (hour < 18) return t('home.greeting.afternoon');
        return t('home.greeting.evening');
    };

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
                        <Text style={styles.subtitle}>
                            {t('home.taskCount', { count: pendingTasks.length })}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0) || 'A'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* AI Suggestions */}
                {activeSuggestions.length > 0 && (
                    <View style={styles.section}>
                        {activeSuggestions.map((suggestion) => (
                            <AISuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onDismiss={() => dismissSuggestion(suggestion.id)}
                                onAccept={() => {
                                    dismissSuggestion(suggestion.id);
                                }}
                            />
                        ))}
                    </View>
                )}

                {/* Today's Tasks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {t('home.todayTasks')}
                    </Text>

                    {pendingTasks.length === 0 ? (
                        <EmptyState
                            icon={CheckCircle2}
                            title={i18n.language === 'en' ? "Congratulations! 🎉" : "Tebrikler! 🎉"}
                            description={i18n.language === 'en'
                                ? "You've completed all your tasks. Add a new task to keep planning your day."
                                : "Tüm görevlerini tamamladın. Yeni görev ekleyerek gününü planlamaya devam et."}
                            actionLabel={t('tasks.addTask')}
                            onAction={() => router.push('/task/create')}
                            iconColor={colors.success}
                        />
                    ) : (
                        pendingTasks.slice(0, 5).map((task) => (
                            <SwipeableTaskCard
                                key={task.id}
                                task={task}
                                onPress={() => router.push(`/task/${task.id}`)}
                                onToggleComplete={() => toggleComplete(task.id)}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))
                    )}

                    {pendingTasks.length > 5 && (
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={() => router.push('/(tabs)/tasks')}
                        >
                            <Text style={styles.seeAllText}>
                                {t('home.seeAll')} ({pendingTasks.length})
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Buttons */}
            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fabSecondary}>
                    <Mic size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/task/create')}
                >
                    <LinearGradient
                        colors={gradients.primary}
                        style={styles.fabGradient}
                    >
                        <Plus size={28} color="#FFFFFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: spacing.lg,
            paddingTop: Platform.OS === 'android' ? spacing.lg + (StatusBar.currentHeight || 24) : spacing.lg,
            paddingBottom: 100,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.xxl,
        },
        greeting: {
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 'bold',
        },
        subtitle: {
            color: colors.textSecondary,
            fontSize: 16,
            marginTop: spacing.xs,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 'bold',
        },
        section: {
            marginBottom: spacing.xxl,
        },
        sectionTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: spacing.md,
        },
        emptyText: {
            color: colors.textSecondary,
            fontSize: 16,
            textAlign: 'center',
        },
        seeAllButton: {
            alignItems: 'center',
            paddingVertical: spacing.md,
        },
        seeAllText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '600',
        },
        fabContainer: {
            position: 'absolute',
            bottom: spacing.xxl,
            right: spacing.lg,
            flexDirection: 'row',
            gap: spacing.md,
            alignItems: 'center',
        },
        fabSecondary: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 4,
        },
        fab: {
            width: 60,
            height: 60,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
        },
        fabGradient: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

