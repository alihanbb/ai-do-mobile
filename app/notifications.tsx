import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationCard } from '../src/components/NotificationCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/themeStore';
import { getColors, spacing, borderRadius } from '../constants/colors';
import { ArrowLeft, BellOff, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type FilterType = 'all' | 'pending' | 'sent';

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const router = useRouter();
    const styles = createStyles(colors, isDark);

    const {
        reminders,
        isLoading,
        fetchReminders,
        registerPushForUser,
        cancelReminder,
        deleteReminder
    } = useNotificationStore();

    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        fetchReminders();
        registerPushForUser();
    }, []);

    const filteredReminders = useMemo(() => {
        if (!reminders) return [];
        if (filter === 'all') return reminders;
        if (filter === 'pending') return reminders.filter(r => r.status === 'Pending');
        if (filter === 'sent') return reminders.filter(r => r.status === 'Sent');
        return reminders;
    }, [reminders, filter]);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/profile');
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('notifications.title') || 'Bildirimler'}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Premium Filter Tabs */}
            <View style={styles.tabsContainer}>
                {['all', 'pending', 'sent'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            filter === tab && styles.activeTab
                        ]}
                        onPress={() => setFilter(tab as FilterType)}
                    >
                        <Text style={[
                            styles.tabText,
                            filter === tab && styles.activeTabText
                        ]}>
                            {tab === 'all' ? (t('common.all') || 'Tümü') :
                                tab === 'pending' ? (t('common.pending') || 'Bekleyen') :
                                    (t('common.sent') || 'Geçmiş')}
                        </Text>
                        {tab === 'all' && reminders.length > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{reminders.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <BellOff size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>
                {filter === 'all' ? (t('notifications.emptyTitle') || 'Bildirim Yok') : (t('notifications.noResults') || 'Sonuç Bulunamadı')}
            </Text>
            <Text style={styles.emptyText}>
                {filter === 'all'
                    ? (t('notifications.emptyText') || 'Henüz size ulaşan yeni bir bildirim yok.\nÖnemli hatırlatmalar burada görünecek.')
                    : (t('notifications.filterEmpty') || 'Bu kategoride herhangi bir bildirim bulunmuyor.')}
            </Text>

            <TouchableOpacity onPress={() => fetchReminders()} style={styles.refreshButton}>
                <Text style={styles.refreshButtonText}>Yenile</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {renderHeader()}

            <FlatList
                data={filteredReminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationCard
                        reminder={item}
                        onCancel={cancelReminder}
                        onDelete={deleteReminder}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={fetchReminders}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeTab: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 8,
        minWidth: 18,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    listContent: {
        padding: spacing.md,
        paddingTop: spacing.lg,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        padding: spacing.xxxl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xxxl,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.surfaceSolid,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.border,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    emptyText: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 280,
    },
    refreshButton: {
        marginTop: spacing.xl,
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: colors.primary + '15',
        borderRadius: borderRadius.lg,
    },
    refreshButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    }
});
