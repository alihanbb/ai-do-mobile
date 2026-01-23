import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { ArrowLeft, Bell, Mail, Smartphone } from 'lucide-react-native';
import { userApi } from '../../src/features/auth/infrastructure/api/userApi';
import { UserPreferencesDto } from '../../src/features/auth/infrastructure/api/userApiTypes';
import { Card } from '../../components/ui/Card';

export default function NotificationSettingsScreen() {
    const { t } = useTranslation();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const router = useRouter();
    const styles = createStyles(colors, isDark);

    const [preferences, setPreferences] = useState<UserPreferencesDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const result = await userApi.getPreferences();
            if (result.success && result.data) {
                setPreferences(result.data);
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
            Alert.alert(t('common.error'), t('common.loadError') || 'Ayarlar yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (key: keyof UserPreferencesDto) => {
        if (!preferences) return;

        const newValue = !preferences[key];
        const oldPreferences = { ...preferences }; // Backup for rollback

        // Optimistic update
        setPreferences({ ...preferences, [key]: newValue });
        setSavingKey(key as string);

        try {
            // Construct the update object based on the new state
            // Note: If we toggle 'notificationsEnabled' (master), we might want to handle logic here,
            // but usually the backend handles the "master switch" logic or we send all flags.
            const updatePayload = {
                notificationsEnabled: key === 'notificationsEnabled' ? newValue : preferences.notificationsEnabled,
                emailNotifications: key === 'emailNotifications' ? newValue : preferences.emailNotifications,
                pushNotifications: key === 'pushNotifications' ? newValue : preferences.pushNotifications,
            };

            const result = await userApi.updateNotifications(updatePayload);

            if (!result.success) {
                throw new Error(result.error?.message || 'Update failed');
            }
        } catch (error) {
            console.error('Failed to update notifications:', error);
            // Rollback
            setPreferences(oldPreferences);
            Alert.alert(t('common.error'), t('common.updateError') || 'Güncelleme başarısız oldu');
        } finally {
            setSavingKey(null);
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('notifications.settings') || 'Bildirim Ayarları'}</Text>
                <View style={{ width: 40 }} />
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            {renderHeader()}

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>{t('notifications.general') || 'GENEL'}</Text>

                <Card variant='default' padding='none' style={styles.card}>
                    {/* Master Toggle */}
                    <View style={[styles.row, styles.borderBottom]}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                <Bell size={22} color={colors.primary} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>{t('notifications.allowNotifications') || 'Bildirimlere İzin Ver'}</Text>
                                <Text style={styles.hint}>{t('notifications.allowNotificationsHint') || 'Tüm bildirimleri aç/kapat'}</Text>
                            </View>
                        </View>
                        {savingKey === 'notificationsEnabled' ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Switch
                                value={preferences?.notificationsEnabled ?? false}
                                onValueChange={() => handleToggle('notificationsEnabled')}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={'#fff'}
                            />
                        )}
                    </View>
                </Card>

                {preferences?.notificationsEnabled && (
                    <>
                        <Text style={styles.sectionTitle}>{t('notifications.channels') || 'KANALLAR'}</Text>
                        <Card variant='default' padding='none' style={styles.card}>
                            {/* Push Notifications */}
                            <View style={[styles.row, styles.borderBottom]}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '15' }]}>
                                        <Smartphone size={22} color={colors.secondary} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.label}>{t('notifications.pushNotifications') || 'Push Bildirimleri'}</Text>
                                        <Text style={styles.hint}>{t('notifications.pushHint') || 'Mobil cihazına anlık bildirimler'}</Text>
                                    </View>
                                </View>
                                {savingKey === 'pushNotifications' ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Switch
                                        value={preferences?.pushNotifications ?? false}
                                        onValueChange={() => handleToggle('pushNotifications')}
                                        trackColor={{ false: colors.border, true: colors.primary }}
                                        thumbColor={'#fff'}
                                    />
                                )}
                            </View>

                            {/* Email Notifications */}
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: colors.warning + '15' }]}>
                                        <Mail size={22} color={colors.warning} />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.label}>{t('notifications.emailNotifications') || 'E-posta Bildirimleri'}</Text>
                                        <Text style={styles.hint}>{t('notifications.emailHint') || 'Önemli güncellemeler ve özetler'}</Text>
                                    </View>
                                </View>
                                {savingKey === 'emailNotifications' ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <Switch
                                        value={preferences?.emailNotifications ?? false}
                                        onValueChange={() => handleToggle('emailNotifications')}
                                        trackColor={{ false: colors.border, true: colors.primary }}
                                        thumbColor={'#fff'}
                                    />
                                )}
                            </View>
                        </Card>
                    </>
                )}

                <Text style={styles.infoText}>
                    {t('notifications.info') || 'Bildirim tercihlerinizi buradan yönetebilirsiniz. Ana bildirimleri kapattığınızda diğer kanallar da devre dışı kalacaktır.'}
                </Text>

            </ScrollView>
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
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
        marginLeft: spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        marginBottom: spacing.lg,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        backgroundColor: colors.surface,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    hint: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    infoText: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
        marginHorizontal: spacing.lg,
        lineHeight: 20,
    }
});
