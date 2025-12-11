import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { TaskCategory, categoryColors } from '../../types/task';

interface CategoryChartProps {
    data: { category: TaskCategory; count: number; label: string }[];
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
    work: 'İş',
    personal: 'Kişisel',
    health: 'Sağlık',
    education: 'Eğitim',
    shopping: 'Alışveriş',
    finance: 'Finans',
    social: 'Sosyal',
    other: 'Diğer',
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const total = data.reduce((sum, item) => sum + item.count, 0);
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    const styles = createStyles(colors);

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Kategori Dağılımı</Text>
                <Text style={styles.emptyText}>Henüz kategorize edilmiş görev yok</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kategori Dağılımı</Text>
            <View style={styles.chart}>
                {data.map((item, index) => {
                    const percentage = total > 0 ? (item.count / total) * 100 : 0;
                    const barWidth = (item.count / maxCount) * 100;

                    return (
                        <View key={index} style={styles.row}>
                            <View style={styles.labelContainer}>
                                <View
                                    style={[
                                        styles.categoryDot,
                                        { backgroundColor: categoryColors[item.category] },
                                    ]}
                                />
                                <Text style={styles.label}>
                                    {CATEGORY_LABELS[item.category]}
                                </Text>
                            </View>
                            <View style={styles.barRow}>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                width: `${barWidth}%`,
                                                backgroundColor: categoryColors[item.category],
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.count}>{item.count}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            marginBottom: spacing.lg,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: spacing.lg,
        },
        emptyText: {
            color: colors.textMuted,
            fontSize: 14,
            textAlign: 'center',
            paddingVertical: spacing.xl,
        },
        chart: {
            gap: spacing.md,
        },
        row: {
            gap: spacing.xs,
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.xs,
        },
        categoryDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        label: {
            color: colors.textSecondary,
            fontSize: 13,
        },
        barRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        barBackground: {
            flex: 1,
            height: 8,
            backgroundColor: colors.border,
            borderRadius: borderRadius.full,
            overflow: 'hidden',
        },
        barFill: {
            height: '100%',
            borderRadius: borderRadius.full,
        },
        count: {
            color: colors.textMuted,
            fontSize: 12,
            width: 24,
            textAlign: 'right',
        },
    });
