import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { ChevronRight } from 'lucide-react-native';
import { TaskCategory, categoryColors } from '../../types/task';

interface TopCategory {
    category: TaskCategory;
    label: string;
    count: number;
    change?: string;
}

interface TopCategoriesProps {
    categories: TopCategory[];
    title?: string;
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

export const TopCategories: React.FC<TopCategoriesProps> = ({
    categories,
    title = 'En çok tamamlanan kategoriler'
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    if (categories.length === 0) return null;

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
            <View style={[styles.container, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
                {categories.map((item, index) => (
                    <View
                        key={index}
                        style={[
                            styles.row,
                            index < categories.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                        ]}
                    >
                        <View style={styles.left}>
                            <View style={[styles.dot, { backgroundColor: categoryColors[item.category] }]} />
                            <Text style={[styles.label, { color: colors.textPrimary }]}>
                                {CATEGORY_LABELS[item.category]}
                            </Text>
                            <View style={[styles.badge, { backgroundColor: categoryColors[item.category] + '20' }]}>
                                <Text style={[styles.badgeText, { color: categoryColors[item.category] }]}>
                                    {item.count} görev
                                </Text>
                            </View>
                        </View>
                        <View style={styles.right}>
                            {item.change && (
                                <Text style={[styles.change, { color: colors.textMuted }]}>
                                    {item.change}
                                </Text>
                            )}
                            <ChevronRight size={18} color={colors.textMuted} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    container: {
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flex: 1,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    change: {
        fontSize: 14,
    },
});
