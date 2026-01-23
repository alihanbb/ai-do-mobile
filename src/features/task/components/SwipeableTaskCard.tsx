import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Task, categoryColors, priorityColors } from '../../types/task';
import { getColors, borderRadius, spacing } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import {
    Check,
    Clock,
    Calendar,
    Tag,
    ChevronDown,
    ChevronUp,
    FileText,
    ListChecks,
    Bell,
    Flame,
    Zap,
    AlertTriangle,
    Sparkles,
    Trash2,
    Edit2
} from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SwipeableTaskCardProps {
    task: Task;
    onPress?: () => void;
    onToggleComplete: () => void;
    onDelete: () => void;
    onToggleSubtask?: (subtaskId: string) => void;
}

export const SwipeableTaskCard = React.memo(function SwipeableTaskCard({
    task,
    onPress,
    onToggleComplete,
    onDelete,
    onToggleSubtask,
}: SwipeableTaskCardProps) {
    // Styles setup
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);
    const [isExpanded, setIsExpanded] = useState(false);

    // Animated checkbox
    const checkScale = useSharedValue(task.completed ? 1 : 0);
    const styles = createStyles(colors, isDark);

    useEffect(() => {
        checkScale.value = withSpring(task.completed ? 1 : 0, { damping: 12 });
    }, [task.completed]);

    const categoryColor = task.category ? categoryColors[task.category] : colors.primary;
    const priorityColor = priorityColors[task.priority];

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return null;
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return t('common.today') || 'Today'; // Assuming 'common.today' exists or fallback
        if (date.toDateString() === tomorrow.toDateString()) return t('common.tomorrow') || 'Tomorrow';

        const locale = t('locale') === 'tr' ? 'tr-TR' : 'en-US';
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    };

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const hasDetails = task.description || (task.subtasks && task.subtasks.length > 0) || (task.tags && task.tags.length > 0);

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value,
    }));

    // Clean Design Structure
    return (
        <Reanimated.View style={styles.container}>
            <TouchableOpacity
                onPress={hasDetails ? toggleExpand : onPress}
                activeOpacity={0.7}
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? colors.surfaceSolid : colors.surface,
                        borderColor: isOverdue ? colors.error : 'transparent',
                        borderWidth: isOverdue ? 1 : 0
                    }
                ]}
            >
                {/* Left: Priority Indicator Bar */}
                <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />

                <View style={styles.content}>
                    {/* Checkbox */}
                    <TouchableOpacity
                        onPress={onToggleComplete}
                        style={[
                            styles.checkbox,
                            {
                                borderColor: task.completed ? colors.success : colors.border,
                                backgroundColor: task.completed ? colors.success + '20' : 'transparent'
                            }
                        ]}
                    >
                        {task.completed && (
                            <Reanimated.View style={checkAnimatedStyle}>
                                <Check size={14} color={colors.success} strokeWidth={3} />
                            </Reanimated.View>
                        )}
                    </TouchableOpacity>

                    {/* Main Info */}
                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                styles.title,
                                { color: isOverdue ? colors.error : colors.textPrimary },
                                task.completed && styles.titleCompleted
                            ]}
                            numberOfLines={1}
                        >
                            {task.title}
                        </Text>

                        <View style={styles.metaRow}>
                            {task.category && (
                                <View style={[styles.badge, { backgroundColor: categoryColor + '15' }]}>
                                    <Text style={[styles.badgeText, { color: categoryColor }]}>
                                        {t(`categories.${task.category}`)}
                                    </Text>
                                </View>
                            )}

                            {task.dueDate && (
                                <View style={styles.metaItem}>
                                    <Calendar size={12} color={isOverdue ? colors.error : colors.textMuted} />
                                    <Text style={[styles.metaText, isOverdue && { color: colors.error }]}>
                                        {formatDate(task.dueDate)}
                                    </Text>
                                </View>
                            )}

                            {task.dueTime && (
                                <View style={styles.metaItem}>
                                    <Clock size={12} color={colors.textMuted} />
                                    <Text style={styles.metaText}>{task.dueTime}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Right Action / Expand Icon */}
                    {hasDetails && (
                        <View style={styles.expandIcon}>
                            {isExpanded ? <ChevronUp size={20} color={colors.textMuted} /> : <ChevronDown size={20} color={colors.textMuted} />}
                        </View>
                    )}
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                    <View style={[styles.details, { borderTopColor: colors.border }]}>
                        {task.description && (
                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                {task.description}
                            </Text>
                        )}

                        {/* Subtasks would go here */}

                        <View style={styles.actions}>
                            <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
                                <Edit2 size={16} color={colors.primary} />
                                <Text style={[styles.actionText, { color: colors.primary }]}>{t('common.edit') || 'Edit'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
                                <Trash2 size={16} color={colors.error} />
                                <Text style={[styles.actionText, { color: colors.error }]}>{t('common.delete') || 'Delete'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </Reanimated.View>
    );
}, (prevProps, nextProps) => {
    return prevProps.task.id === nextProps.task.id &&
        prevProps.task.completed === nextProps.task.completed &&
        prevProps.task.title === nextProps.task.title &&
        prevProps.task.priority === nextProps.task.priority &&
        prevProps.task.category === nextProps.task.category &&
        prevProps.task.dueDate === nextProps.task.dueDate;
});

const createStyles = (colors: ReturnType<typeof getColors>, isDark: boolean) =>
    StyleSheet.create({
        container: {
            marginVertical: 6,
            marginHorizontal: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 8,
            elevation: 3,
        },
        card: {
            borderRadius: 16,
            overflow: 'hidden',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
        },
        priorityIndicator: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            marginLeft: 8,
        },
        textContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 6,
        },
        titleCompleted: {
            textDecorationLine: 'line-through',
            opacity: 0.6,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
        },
        badge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 6,
        },
        badgeText: {
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        metaText: {
            color: colors.textMuted,
            fontSize: 12,
        },
        expandIcon: {
            padding: 4,
        },
        details: {
            padding: 16,
            paddingTop: 0,
            borderTopWidth: 1,
            marginTop: 4,
        },
        description: {
            fontSize: 14,
            lineHeight: 20,
            marginTop: 12,
            marginBottom: 16,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 16,
        },
        actionBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            padding: 4,
        },
        actionText: {
            fontSize: 12,
            fontWeight: '600',
        }
    });
