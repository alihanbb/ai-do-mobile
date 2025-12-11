import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Task, categoryColors, priorityColors } from '../../types/task';
import { colors, borderRadius, spacing } from '../../constants/colors';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Check, Clock, Calendar } from 'lucide-react-native';

interface TaskCardProps {
    task: Task;
    onPress: () => void;
    onToggleComplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onPress,
    onToggleComplete,
}) => {
    const categoryColor = task.category ? categoryColors[task.category] : colors.textMuted;
    const priorityColor = priorityColors[task.priority];

    const formatDueTime = () => {
        if (!task.dueTime) return null;
        return task.dueTime;
    };

    const formatDuration = () => {
        if (!task.estimatedDuration) return null;
        if (task.estimatedDuration >= 60) {
            const hours = Math.floor(task.estimatedDuration / 60);
            const mins = task.estimatedDuration % 60;
            if (mins > 0) {
                return hours + 's ' + mins + 'dk';
            }
            return hours + ' saat';
        }
        return task.estimatedDuration + 'dk';
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Card variant="default" padding="md" style={styles.card}>
                <View style={styles.content}>
                    <TouchableOpacity
                        onPress={onToggleComplete}
                        style={[
                            styles.checkbox,
                            task.completed && styles.checkboxCompleted,
                            { borderColor: task.completed ? colors.success : categoryColor },
                        ]}
                    >
                        {task.completed && (
                            <Check size={14} color={colors.textPrimary} strokeWidth={3} />
                        )}
                    </TouchableOpacity>

                    <View style={styles.info}>
                        <Text
                            style={[
                                styles.title,
                                task.completed && styles.titleCompleted,
                            ]}
                            numberOfLines={1}
                        >
                            {task.title}
                        </Text>

                        <View style={styles.meta}>
                            {task.dueTime && (
                                <View style={styles.metaItem}>
                                    <Clock size={12} color={colors.textMuted} />
                                    <Text style={styles.metaText}>{formatDueTime()}</Text>
                                </View>
                            )}
                            {task.estimatedDuration && (
                                <View style={styles.metaItem}>
                                    <Calendar size={12} color={colors.textMuted} />
                                    <Text style={styles.metaText}>{formatDuration()}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View
                        style={[
                            styles.priorityIndicator,
                            { backgroundColor: priorityColor },
                        ]}
                    />
                </View>

                {task.category && (
                    <View style={styles.badges}>
                        <Badge
                            label={task.category}
                            variant="default"
                        />
                    </View>
                )}
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    info: {
        flex: 1,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    titleCompleted: {
        color: colors.textMuted,
        textDecorationLine: 'line-through',
    },
    meta: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaText: {
        color: colors.textMuted,
        fontSize: 12,
    },
    priorityIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginLeft: spacing.md,
    },
    badges: {
        flexDirection: 'row',
        marginTop: spacing.sm,
        gap: spacing.xs,
    },
});
