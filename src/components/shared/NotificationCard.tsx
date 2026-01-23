import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reminder } from '../core/infrastructure/api/notificationApi';
import { Bell, Clock, Trash2, XCircle, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationCardProps {
    reminder: Reminder;
    onCancel: (id: string) => void;
    onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ reminder, onCancel, onDelete }) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const styles = createStyles(colors, isDark);
    const { t, i18n } = useTranslation();

    const isPending = reminder.status === 'Pending';

    const statusConfig = useMemo(() => {
        switch (reminder.status) {
            case 'Pending':
                return {
                    color: colors.primary,
                    bg: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    icon: <Clock size={14} color={colors.primary} />,
                    label: t('common.pending') || 'Bekliyor'
                };
            case 'Sent':
                return {
                    color: colors.success,
                    bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    icon: <CheckCircle2 size={14} color={colors.success} />,
                    label: t('common.sent') || 'Gönderildi'
                };
            case 'Failed':
                return {
                    color: colors.error,
                    bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    icon: <AlertCircle size={14} color={colors.error} />,
                    label: t('common.failed') || 'Hata'
                };
            case 'Cancelled':
                return {
                    color: colors.textMuted,
                    bg: isDark ? 'rgba(156, 163, 175, 0.15)' : '#f9fafb',
                    borderColor: 'rgba(156, 163, 175, 0.3)',
                    icon: <XCircle size={14} color={colors.textMuted} />,
                    label: t('common.cancelled') || 'İptal'
                };
            default:
                return {
                    color: colors.textSecondary,
                    bg: colors.surfaceSolid,
                    borderColor: colors.border,
                    icon: <Bell size={14} color={colors.textSecondary} />,
                    label: reminder.status
                };
        }
    }, [reminder.status, colors, isDark, t]);

    const formattedDate = useMemo(() => {
        if (!reminder.remindAt) return t('common.noDate');
        try {
            const date = new Date(reminder.remindAt);
            return date.toLocaleString(i18n.language === 'en' ? 'en-US' : 'tr-TR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return reminder.remindAt;
        }
    }, [reminder.remindAt, i18n.language, t]);

    return (
        <View style={styles.card}>
            <View style={styles.contentRow}>
                {/* Icon Column */}
                <View style={[styles.iconContainer, { backgroundColor: statusConfig.bg }]}>
                    <Bell size={22} color={statusConfig.color} />
                </View>

                {/* Content Column */}
                <View style={styles.textCol}>
                    <View style={styles.header}>
                        <Text style={styles.title} numberOfLines={1}>{reminder.title}</Text>
                        <View style={[styles.statusBadge, {
                            backgroundColor: statusConfig.bg,
                            borderColor: statusConfig.borderColor
                        }]}>
                            {statusConfig.icon}
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                {statusConfig.label}
                            </Text>
                        </View>
                    </View>

                    {reminder.message && (
                        <Text style={styles.message} numberOfLines={2}>{reminder.message}</Text>
                    )}

                    <View style={styles.footer}>
                        <View style={styles.timeContainer}>
                            <Clock size={12} color={colors.textMuted} />
                            <Text style={styles.time}>{formattedDate}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Actions (Swipe-like or footer buttons) */}
            <View style={styles.actionsContainer}>
                {isPending && (
                    <TouchableOpacity
                        onPress={() => onCancel(reminder.id)}
                        style={[styles.actionButton, styles.cancelButton]}
                    >
                        <Text style={styles.actionTextCancel}>{t('common.cancel') || 'İptal Et'}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => onDelete(reminder.id)}
                    style={[styles.actionButton, styles.deleteButton]}
                >
                    <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>, isDark: boolean) => StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        paddingBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    contentRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCol: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
        lineHeight: 22,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: borderRadius.md,
        gap: 4,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    message: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.surfaceSolid,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    time: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: spacing.sm,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.surfaceSolid,
        borderWidth: 1,
        borderColor: colors.border,
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        width: 40,
        height: 36,
        paddingHorizontal: 0,
        borderRadius: borderRadius.lg,
    },
    actionTextCancel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});
