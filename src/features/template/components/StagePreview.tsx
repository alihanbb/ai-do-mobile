import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemplateStage } from '../../src/features/template/domain/entities/Template';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { Circle } from 'lucide-react-native';

interface StagePreviewProps {
    stage: TemplateStage;
    stageNumber: number;
}

export const StagePreview: React.FC<StagePreviewProps> = ({ stage, stageNumber }) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            {/* Stage Header */}
            <View style={styles.header}>
                <Text style={styles.icon}>{stage.icon}</Text>
                <Text style={styles.title}>{stage.title}</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{stage.tasks.length}</Text>
                </View>
            </View>

            {/* Tasks List */}
            <View style={styles.taskList}>
                {stage.tasks.map((task, index) => (
                    <View key={index} style={styles.taskItem}>
                        <Circle size={18} color={colors.textMuted} strokeWidth={1.5} />
                        <View style={styles.taskContent}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            {task.description && (
                                <Text style={styles.taskDescription} numberOfLines={1}>
                                    {task.description}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            marginBottom: spacing.lg,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.md,
            gap: spacing.sm,
        },
        icon: {
            fontSize: 18,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            flex: 1,
        },
        countBadge: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.full,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderWidth: 1,
            borderColor: colors.border,
        },
        countText: {
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: '500',
        },
        taskList: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        taskItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            gap: spacing.sm,
        },
        taskContent: {
            flex: 1,
        },
        taskTitle: {
            color: colors.textPrimary,
            fontSize: 14,
        },
        taskDescription: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 2,
        },
    });
