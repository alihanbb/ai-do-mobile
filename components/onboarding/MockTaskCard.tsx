// components/onboarding/MockTaskCard.tsx
// Mock task card preview for onboarding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Flag, Clock, Tag } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../constants/colors';

export const MockTaskCard: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Task Header */}
            <View style={styles.header}>
                <View style={styles.checkbox}>
                    <Check size={14} color={colors.textPrimary} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>Toplantı hazırlığı yap</Text>
                    <Text style={styles.description}>Sunum materyallerini hazırla</Text>
                </View>
            </View>

            {/* Task Metadata */}
            <View style={styles.metaRow}>
                <View style={[styles.badge, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Tag size={12} color="#3b82f6" />
                    <Text style={[styles.badgeText, { color: '#3b82f6' }]}>İş</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                    <Flag size={12} color="#ef4444" />
                    <Text style={[styles.badgeText, { color: '#ef4444' }]}>Acil</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>14:00</Text>
                </View>
            </View>

            {/* Subtasks Progress */}
            <View style={styles.subtasksContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '66%' }]} />
                </View>
                <Text style={styles.subtaskText}>2/3 alt görev</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    description: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
    },
    subtasksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    subtaskText: {
        fontSize: 12,
        color: colors.textMuted,
    },
});
