import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Task, categoryColors, priorityColors } from '../../types/task';
import { colors, borderRadius, spacing } from '../../constants/colors';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Check, Clock, Calendar, Trash2 } from 'lucide-react-native';

interface SwipeableTaskCardProps {
    task: Task;
    onPress: () => void;
    onToggleComplete: () => void;
    onDelete: () => void;
}

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + 80 }],
        };
    });

    return (
        <Reanimated.View style={[styles.rightAction, styleAnimation]}>
            <Trash2 size={24} color={colors.textPrimary} />
            <Text style={styles.actionText}>Sil</Text>
        </Reanimated.View>
    );
}

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value - 80 }],
        };
    });

    return (
        <Reanimated.View style={[styles.leftAction, styleAnimation]}>
            <Check size={24} color={colors.textPrimary} />
            <Text style={styles.actionText}>Tamamla</Text>
        </Reanimated.View>
    );
}

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
    task,
    onPress,
    onToggleComplete,
    onDelete,
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

    const handleSwipeableOpen = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            onDelete();
        } else {
            onToggleComplete();
        }
    };

    return (
        <ReanimatedSwipeable
            containerStyle={styles.swipeableContainer}
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            leftThreshold={40}
            renderRightActions={RightAction}
            renderLeftActions={LeftAction}
            onSwipeableOpen={handleSwipeableOpen}
        >
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
        </ReanimatedSwipeable>
    );
};

const styles = StyleSheet.create({
    swipeableContainer: {
        marginBottom: spacing.sm,
    },
    card: {
        backgroundColor: colors.surfaceSolid,
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
    rightAction: {
        width: 80,
        backgroundColor: colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
    },
    leftAction: {
        width: 80,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
    },
    actionText: {
        color: colors.textPrimary,
        fontSize: 12,
        marginTop: spacing.xs,
    },
});
