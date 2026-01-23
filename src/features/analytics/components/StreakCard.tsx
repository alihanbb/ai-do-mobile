import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { Flame, Trophy, Target } from 'lucide-react-native';

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
    todayCompleted: boolean;
}

export const StreakCard = React.memo(function StreakCard({
    currentStreak,
    longestStreak,
    todayCompleted,
}: StreakCardProps) {
    const { isDark } = useThemeStore();
    const { i18n } = useTranslation();
    const colors = getColors(isDark);

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.primary + '20', colors.accent + '10']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.content}>
                    <View style={styles.mainStreak}>
                        <View style={styles.iconContainer}>
                            <Flame size={32} color={colors.warning} />
                        </View>
                        <View>
                            <Text style={styles.streakNumber}>{currentStreak}</Text>
                            <Text style={styles.streakLabel}>
                                {i18n.language === 'en' ? 'Daily Streak' : 'Günlük Seri'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Trophy size={18} color={colors.warningLight} />
                            <Text style={styles.statValue}>{longestStreak}</Text>
                            <Text style={styles.statLabel}>
                                {i18n.language === 'en' ? 'Longest' : 'En Uzun'}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Target size={18} color={todayCompleted ? colors.success : colors.textMuted} />
                            <Text style={[styles.statValue, todayCompleted && { color: colors.success }]}>
                                {todayCompleted ? '✓' : '○'}
                            </Text>
                            <Text style={styles.statLabel}>
                                {i18n.language === 'en' ? 'Today' : 'Bugün'}
                            </Text>
                        </View>
                    </View>

                    {!todayCompleted && (
                        <Text style={styles.motivationText}>
                            {i18n.language === 'en'
                                ? 'Complete a task today to keep your streak!'
                                : 'Seriyi devam ettirmek için bugün bir görev tamamla!'}
                        </Text>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
});

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            borderRadius: borderRadius.xl,
            overflow: 'hidden',
            marginBottom: spacing.lg,
        },
        gradient: {
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
        },
        content: {
            padding: spacing.lg,
        },
        mainStreak: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            marginBottom: spacing.lg,
        },
        iconContainer: {
            width: 56,
            height: 56,
            borderRadius: borderRadius.md,
            backgroundColor: colors.warning + '20',
            alignItems: 'center',
            justifyContent: 'center',
        },
        streakNumber: {
            color: colors.textPrimary,
            fontSize: 36,
            fontWeight: 'bold',
        },
        streakLabel: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        statItem: {
            flex: 1,
            alignItems: 'center',
            gap: spacing.xs,
        },
        divider: {
            width: 1,
            height: 40,
            backgroundColor: colors.border,
        },
        statValue: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12,
        },
        motivationText: {
            color: colors.textSecondary,
            fontSize: 13,
            textAlign: 'center',
            marginTop: spacing.md,
            fontStyle: 'italic',
        },
    });
