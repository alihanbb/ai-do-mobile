import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { TrendingDown, TrendingUp } from 'lucide-react-native';

interface HeroStatCardProps {
    value: string;
    label: string;
    changePercent: number;
    changeLabel?: string;
    isPositive?: boolean;
}

export const HeroStatCard = React.memo(function HeroStatCard({
    value,
    label,
    changePercent,
    changeLabel,
    isPositive = true,
}: HeroStatCardProps) {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const changeColor = isPositive ? colors.success : colors.error;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <View style={[styles.container, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: changeColor + '20' }]}>
                <TrendIcon size={28} color={changeColor} />
            </View>

            <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>

            <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
                <Text style={[styles.changeText, { color: changeColor }]}>
                    {isPositive ? '▲' : '▼'} {label} %{Math.abs(changePercent)} {changeLabel || 'değişim'}
                </Text>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: spacing.xl,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    value: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    changeContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    changeText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
