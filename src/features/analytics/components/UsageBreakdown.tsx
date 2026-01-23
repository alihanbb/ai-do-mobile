import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';

interface UsageBreakdownProps {
    data: {
        label: string;
        percent: number;
        color: string;
    }[];
    title?: string;
}

export const UsageBreakdown = React.memo(function UsageBreakdown({
    data,
    title = 'Kullanım'
}: UsageBreakdownProps) {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    return (
        <View style={[styles.container, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

            <View style={styles.bars}>
                {data.map((item, index) => (
                    <View key={index} style={styles.barItem}>
                        <View style={styles.labelRow}>
                            <View style={styles.labelContainer}>
                                <View style={[styles.dot, { backgroundColor: item.color }]} />
                                <Text style={[styles.label, { color: colors.textPrimary }]}>
                                    {item.label}
                                </Text>
                            </View>
                            <Text style={[styles.percent, { color: item.color }]}>
                                {item.percent}%
                            </Text>
                        </View>
                        {item.percent > 0 && (
                            <View style={[styles.barBackground, { backgroundColor: colors.border }]}>
                                <View
                                    style={[
                                        styles.barFill,
                                        {
                                            width: `${item.percent}%`,
                                            backgroundColor: item.color,
                                        }
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.lg,
    },
    bars: {
        gap: spacing.md,
    },
    barItem: {
        gap: spacing.xs,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    label: {
        fontSize: 14,
    },
    percent: {
        fontSize: 14,
        fontWeight: '600',
    },
    barBackground: {
        height: 8,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: borderRadius.full,
    },
});
