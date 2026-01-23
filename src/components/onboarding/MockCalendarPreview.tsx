// components/onboarding/MockCalendarPreview.tsx
// Mock calendar and analytics preview for onboarding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../constants/colors';

export const MockCalendarPreview: React.FC = () => {
    const weekDays = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
    const taskCounts = [3, 5, 2, 4, 0, 1, 2]; // Mock data

    return (
        <View style={styles.container}>
            {/* Mini Calendar */}
            <View style={styles.calendarCard}>
                <View style={styles.cardHeader}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={styles.cardTitle}>Bu Hafta</Text>
                </View>
                <View style={styles.weekRow}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.dayColumn}>
                            <Text style={styles.dayLabel}>{day}</Text>
                            <View
                                style={[
                                    styles.dayDot,
                                    taskCounts[index] > 0 && styles.dayDotActive,
                                    taskCounts[index] > 3 && styles.dayDotHigh,
                                ]}
                            >
                                {taskCounts[index] > 0 && (
                                    <Text style={styles.dayCount}>{taskCounts[index]}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <TrendingUp size={20} color={colors.success} />
                    <Text style={styles.statValue}>85%</Text>
                    <Text style={styles.statLabel}>Tamamlama</Text>
                </View>
                <View style={styles.statCard}>
                    <BarChart3 size={20} color={colors.primary} />
                    <Text style={styles.statValue}>17</Text>
                    <Text style={styles.statLabel}>Bu Hafta</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    calendarCard: {
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayColumn: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    dayLabel: {
        fontSize: 12,
        color: colors.textMuted,
    },
    dayDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayDotActive: {
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
    },
    dayDotHigh: {
        backgroundColor: 'rgba(124, 58, 237, 0.4)',
    },
    dayCount: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        gap: spacing.xs,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
