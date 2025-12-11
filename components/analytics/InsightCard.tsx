import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { Lightbulb } from 'lucide-react-native';

interface InsightCardProps {
    title: string;
    description: string;
    type?: 'positive' | 'negative' | 'neutral';
}

export const InsightCard: React.FC<InsightCardProps> = ({
    title,
    description,
    type = 'neutral'
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const typeColors = {
        positive: colors.success,
        negative: colors.error,
        neutral: colors.primary,
    };

    const accentColor = typeColors[type];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surfaceSolid,
                    borderColor: colors.border,
                    borderLeftColor: accentColor,
                }
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
                <Lightbulb size={20} color={accentColor} />
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {description}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderLeftWidth: 4,
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
});
