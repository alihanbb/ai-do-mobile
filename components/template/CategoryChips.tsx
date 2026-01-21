import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TemplateCategory, templateCategoryLabels, templateCategoryColors } from '../../src/features/template/domain/entities/Template';
import { TEMPLATE_CATEGORIES } from '../../src/features/template/data/templateData';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';

interface CategoryChipsProps {
    selected: TemplateCategory | null;
    onSelect: (category: TemplateCategory | null) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ selected, onSelect }) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {TEMPLATE_CATEGORIES.map((cat) => {
                const isSelected = selected === cat.id;
                const accentColor = cat.id ? templateCategoryColors[cat.id] : colors.primary;

                return (
                    <TouchableOpacity
                        key={cat.id || 'all'}
                        onPress={() => onSelect(cat.id)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.chip,
                                isSelected && {
                                    backgroundColor: accentColor,
                                    borderColor: accentColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    isSelected && styles.chipTextSelected,
                                ]}
                            >
                                {cat.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            gap: spacing.sm,
        },
        chip: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.full,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 2,
        },
        chipText: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500',
        },
        chipTextSelected: {
            color: '#ffffff',
        },
    });
