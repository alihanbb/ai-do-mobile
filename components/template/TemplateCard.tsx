import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Template, templateFormatLabels } from '../../src/features/template/domain/entities/Template';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { List, LayoutGrid } from 'lucide-react-native';

interface TemplateCardProps {
    template: Template;
    onPress: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPress }) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors, template.color);

    // Toplam görev sayısı
    const totalTasks = template.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.card}>
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{template.icon}</Text>
                </View>

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {template.title}
                </Text>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                    {template.description}
                </Text>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.formatBadge}>
                        {template.format === 'list' ? (
                            <List size={12} color={colors.textMuted} />
                        ) : (
                            <LayoutGrid size={12} color={colors.textMuted} />
                        )}
                        <Text style={styles.formatText}>
                            {templateFormatLabels[template.format]}
                        </Text>
                    </View>
                    <Text style={styles.taskCount}>{totalTasks} görev</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>, accentColor: string) =>
    StyleSheet.create({
        card: {
            backgroundColor: colors.card,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
            minHeight: 200,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 3,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.lg,
            backgroundColor: accentColor + '15',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
        },
        icon: {
            fontSize: 24,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 15,
            fontWeight: '600',
            marginBottom: spacing.xs,
            lineHeight: 20,
        },
        description: {
            color: colors.textMuted,
            fontSize: 12,
            lineHeight: 16,
            marginBottom: spacing.sm,
            height: 32,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
        },
        formatBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        formatText: {
            color: colors.textMuted,
            fontSize: 11,
        },
        taskCount: {
            color: colors.textMuted,
            fontSize: 11,
        },
    });
