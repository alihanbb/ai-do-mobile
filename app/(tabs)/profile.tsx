import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Switch,
    Platform,
    StatusBar,
    ActivityIndicator,
    Alert,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../src/core/infrastructure/i18n/i18n';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius, gradients } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { userApi } from '../../src/features/auth/infrastructure/api/userApi';
import { UserPreferencesDto } from '../../src/features/auth/infrastructure/api/userApiTypes';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { sentryService } from '../../src/core/infrastructure/monitoring/sentryService';
import {
    Bell,
    Moon,
    Sun,
    Globe,
    Clock,
    Zap,
    LogOut,
    ChevronRight,
    Crown,
    Edit3,
    Settings,
    HelpCircle,
    Shield,
    AlertTriangle,
    Camera,
} from 'lucide-react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateUser, logout } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);

    // Preferences state
    const [preferences, setPreferences] = useState<UserPreferencesDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Load preferences on mount
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarPress = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    t('common.error'),
                    t('profile.permissionDenied') || 'Galeriye erişim izni gerekiyor.'
                );
                return;
            }

            // Open picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                await uploadAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert(t('common.error'), t('profile.uploadError') || 'Resim seçilirken bir hata oluştu');
        }
    };

    const uploadAvatar = async (uri: string) => {
        setIsUploading(true);
        try {
            const result = await userApi.uploadAvatar(uri);

            if (result.success && result.data) {
                // Update local user store with new avatar URL
                updateUser({
                    ...user!,
                    avatar: result.data.avatarUrl ?? undefined
                });
                Alert.alert(t('common.success'), t('profile.uploadSuccess') || 'Profil fotoğrafı güncellendi');
            } else {
                console.error('Upload failed:', result.error);
                Alert.alert(t('common.error'), t('profile.uploadError') || 'Yükleme başarısız oldu');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert(t('common.error'), t('profile.uploadError') || 'Bir hata oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    // Toggle handlers
    const handleNotificationsToggle = async () => {
        if (!preferences) return;

        const newValue = !preferences.notificationsEnabled;
        setIsSaving('notifications');

        try {
            const result = await userApi.updateNotifications({
                notificationsEnabled: newValue,
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
            });

            if (result.success) {
                setPreferences({ ...preferences, notificationsEnabled: newValue });
            } else {
                Alert.alert('Hata', 'Bildirim ayarları güncellenemedi');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir sorun oluştu');
        } finally {
            setIsSaving(null);
        }
    };

    const handleEnergyTrackingToggle = async () => {
        if (!preferences) return;

        const newValue = !preferences.energyTrackingEnabled;
        setIsSaving('energy');

        try {
            const result = await userApi.updatePreferences({
                ...preferences,
                energyTrackingEnabled: newValue,
            });

            if (result.success) {
                setPreferences({ ...preferences, energyTrackingEnabled: newValue });
            } else {
                Alert.alert('Hata', 'Enerji takibi ayarı güncellenemedi');
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir sorun oluştu');
        } finally {
            setIsSaving(null);
        }
    };

    const handleThemeToggle = async () => {
        const newTheme = isDark ? 'light' : 'dark';
        toggleTheme();

        try {
            await userApi.updateTheme({ theme: newTheme });
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const handleLanguageChange = async (language: 'tr' | 'en') => {
        setIsSaving('language');
        setShowLanguageModal(false);

        try {
            // Change app language immediately (this always works)
            await changeLanguage(language);

            // Try to sync with backend if we have preferences
            if (preferences) {
                const result = await userApi.updatePreferences({
                    ...preferences,
                    language: language,
                });

                if (result.success) {
                    setPreferences({ ...preferences, language: language });
                }
            } else {
                // Create a minimal preferences object for local state
                setPreferences({
                    language: language,
                    notificationsEnabled: false,
                    emailNotifications: false,
                    pushNotifications: false,
                    energyTrackingEnabled: false,
                } as UserPreferencesDto);
            }
        } catch (error) {
            console.error('Language change error:', error);
            // Don't show alert - the local change already happened
        } finally {
            setIsSaving(null);
        }
    };

    const handleSentryTest = () => {
        try {
            // Test exception
            throw new Error('🧪 Sentry Test Error - This is a test crash report!');
        } catch (error) {
            sentryService.captureException(error as Error, {
                test: true,
                screen: 'Profile',
                user: user?.email,
                timestamp: new Date().toISOString(),
            });

            Alert.alert(
                '✅ Test Gönderildi',
                'Sentry\'ye test hatası gönderildi. Birkaç dakika içinde Sentry dashboard\'da görünecektir.',
                [{ text: 'Tamam' }]
            );
        }
    };

    const moreItems = [
        {
            icon: <HelpCircle size={20} color={colors.textSecondary} />,
            label: t('profile.helpSupport'),
            onPress: () => { },
        },
        {
            icon: <Shield size={20} color={colors.textSecondary} />,
            label: t('profile.privacyPolicy'),
            onPress: () => { },
        },
        {
            icon: <Settings size={20} color={colors.textSecondary} />,
            label: t('profile.appSettings'),
            onPress: () => { },
        },
    ];

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>{t('profile.title')}</Text>

                {/* Profile Card */}
                <Card variant='default' padding='lg' style={styles.profileCard}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handleAvatarPress}
                        disabled={isUploading}
                    >
                        {user?.avatarUrl ? (
                            <Image
                                source={{ uri: user.avatarUrl }}
                                style={styles.avatarImage}
                                contentFit="cover"
                                transition={1000}
                            />
                        ) : (
                            <LinearGradient
                                colors={[colors.primary, colors.secondary]}
                                style={styles.avatar}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </Text>
                            </LinearGradient>
                        )}

                        <View style={styles.cameraIconContainer}>
                            {isUploading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Camera size={14} color="#fff" />
                            )}
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'ornek@email.com'}</Text>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push('/edit-profile')}
                    >
                        <Edit3 size={16} color={colors.primary} />
                        <Text style={styles.editButtonText}>{t('profile.editProfile')}</Text>
                    </TouchableOpacity>
                </Card>

                {/* Premium Card */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push('/premium')}
                >
                    <LinearGradient
                        colors={gradients.premium}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.premiumCard}
                    >
                        <View style={styles.premiumLeft}>
                            <View style={styles.premiumIconContainer}>
                                <Crown size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.premiumTitle}>{t('profile.goPremium')}</Text>
                                <Text style={styles.premiumSubtitle}>
                                    {t('profile.premiumSubtitle')}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={24} color="rgba(255,255,255,0.8)" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
                <Card variant='default' padding='none' style={styles.settingsCard}>
                    {/* Theme Toggle */}
                    <View style={[styles.menuItem, styles.menuItemBorder]}>
                        <View style={styles.menuItemLeft}>
                            {isDark ? (
                                <Moon size={20} color={colors.primary} />
                            ) : (
                                <Sun size={20} color={colors.warning} />
                            )}
                            <View>
                                <Text style={styles.menuItemLabel}>
                                    {isDark ? t('profile.darkMode') : t('profile.lightMode')}
                                </Text>
                                <Text style={styles.menuItemHint}>{t('profile.appTheme')}</Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={handleThemeToggle}
                            trackColor={{
                                false: colors.border,
                                true: colors.primary + '50'
                            }}
                            thumbColor={isDark ? colors.primary : colors.textMuted}
                        />
                    </View>

                    {/* Notifications Toggle */}
                    <View style={[styles.menuItem, styles.menuItemBorder]}>
                        <View style={styles.menuItemLeft}>
                            <Bell size={20} color={colors.textSecondary} />
                            <View>
                                <Text style={styles.menuItemLabel}>{t('profile.notifications')}</Text>
                                <Text style={styles.menuItemHint}>
                                    {preferences?.notificationsEnabled ? t('profile.notificationsOn') : t('profile.notificationsOff')}
                                </Text>
                            </View>
                        </View>
                        {isSaving === 'notifications' ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Switch
                                value={preferences?.notificationsEnabled ?? false}
                                onValueChange={handleNotificationsToggle}
                                trackColor={{
                                    false: colors.border,
                                    true: colors.primary + '50'
                                }}
                                thumbColor={preferences?.notificationsEnabled ? colors.primary : colors.textMuted}
                                disabled={isLoading}
                            />
                        )}
                    </View>

                    {/* Language */}
                    <TouchableOpacity
                        style={[styles.menuItem, styles.menuItemBorder]}
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <View style={styles.menuItemLeft}>
                            <Globe size={20} color={colors.textSecondary} />
                            <View>
                                <Text style={styles.menuItemLabel}>{t('profile.language')}</Text>
                                <Text style={styles.menuItemHint}>
                                    {preferences?.language === 'en' ? 'English' : 'Türkçe'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.menuItemRight}>
                            <Text style={styles.menuItemValue}>
                                {preferences?.language === 'en' ? 'English' : 'Türkçe'}
                            </Text>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </View>
                    </TouchableOpacity>

                    {/* Working Hours */}
                    <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                        <View style={styles.menuItemLeft}>
                            <Clock size={20} color={colors.textSecondary} />
                            <View>
                                <Text style={styles.menuItemLabel}>{t('profile.workingHours')}</Text>
                                <Text style={styles.menuItemHint}>{t('profile.workingHoursHint')}</Text>
                            </View>
                        </View>
                        <View style={styles.menuItemRight}>
                            <Text style={styles.menuItemValue}>
                                {preferences?.workingHoursStart && preferences?.workingHoursEnd
                                    ? `${preferences.workingHoursStart} - ${preferences.workingHoursEnd}`
                                    : t('profile.notSet')}
                            </Text>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </View>
                    </TouchableOpacity>

                    {/* Energy Tracking Toggle */}
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Zap size={20} color={colors.textSecondary} />
                            <View>
                                <Text style={styles.menuItemLabel}>{t('profile.energyTracking')}</Text>
                                <Text style={styles.menuItemHint}>
                                    {preferences?.energyTrackingEnabled ? t('profile.notificationsOn') : t('profile.notificationsOff')}
                                </Text>
                            </View>
                        </View>
                        {isSaving === 'energy' ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Switch
                                value={preferences?.energyTrackingEnabled ?? false}
                                onValueChange={handleEnergyTrackingToggle}
                                trackColor={{
                                    false: colors.border,
                                    true: colors.primary + '50'
                                }}
                                thumbColor={preferences?.energyTrackingEnabled ? colors.primary : colors.textMuted}
                                disabled={isLoading}
                            />
                        )}
                    </View>
                </Card>

                {/* More Section */}
                <Text style={styles.sectionTitle}>{t('profile.other')}</Text>
                <Card variant='default' padding='none' style={styles.settingsCard}>
                    {moreItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index < moreItems.length - 1 && styles.menuItemBorder,
                            ]}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuItemLeft}>
                                {item.icon}
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                            </View>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Developer Tools (only show in development) */}
                {__DEV__ && (
                    <>
                        <Text style={styles.sectionTitle}>DEVELOPER TOOLS</Text>
                        <Card variant='default' padding='none' style={styles.settingsCard}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleSentryTest}
                            >
                                <View style={styles.menuItemLeft}>
                                    <AlertTriangle size={20} color={colors.warning} />
                                    <View>
                                        <Text style={styles.menuItemLabel}>Test Sentry</Text>
                                        <Text style={styles.menuItemHint}>
                                            Send test error to Sentry dashboard
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        </Card>
                    </>
                )}

                <Button
                    title={t('auth.logout')}
                    onPress={logout}
                    variant='ghost'
                    icon={<LogOut size={18} color={colors.error} />}
                    fullWidth
                    style={styles.logoutButton}
                />

                {/* App Version */}
                <Text style={styles.version}>AI-Do v1.0.0</Text>
            </ScrollView>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowLanguageModal(false)}
                >
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={styles.modalTitle}>{t('profile.selectLanguage')}</Text>

                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                preferences?.language === 'tr' && styles.languageOptionSelected
                            ]}
                            onPress={() => handleLanguageChange('tr')}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.languageOptionText,
                                preferences?.language === 'tr' && styles.languageOptionTextSelected
                            ]}>
                                🇹🇷 Türkçe
                            </Text>
                            {preferences?.language === 'tr' && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                preferences?.language === 'en' && styles.languageOptionSelected
                            ]}
                            onPress={() => handleLanguageChange('en')}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.languageOptionText,
                                preferences?.language === 'en' && styles.languageOptionTextSelected
                            ]}>
                                🇬🇧 English
                            </Text>
                            {preferences?.language === 'en' && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setShowLanguageModal(false)}
                        >
                            <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: spacing.lg,
            paddingTop: Platform.OS === 'android' ? spacing.lg + (StatusBar.currentHeight || 24) : spacing.lg,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: spacing.xl,
        },
        profileCard: {
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        avatarContainer: {
            marginBottom: spacing.md,
            position: 'relative',
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarImage: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.full,
            backgroundColor: colors.surface,
        },
        cameraIconContainer: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: colors.primary,
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.surfaceSolid,
        },
        avatarText: {
            color: '#fff',
            fontSize: 32,
            fontWeight: 'bold',
        },
        userName: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: '600',
        },
        userEmail: {
            color: colors.textSecondary,
            fontSize: 14,
            marginTop: spacing.xs,
        },
        editButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            marginTop: spacing.md,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.primary + '15',
        },
        editButtonText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '500',
        },
        premiumCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            marginBottom: spacing.xl,
        },
        premiumLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
        },
        premiumIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        premiumTitle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        premiumSubtitle: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 13,
        },
        sectionTitle: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: spacing.md,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        settingsCard: {
            marginBottom: spacing.lg,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
        },
        menuItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        menuItemLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            flex: 1,
        },
        menuItemLabel: {
            color: colors.textPrimary,
            fontSize: 16,
        },
        menuItemHint: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 2,
        },
        menuItemRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        menuItemValue: {
            color: colors.textMuted,
            fontSize: 14,
        },
        logoutButton: {
            marginBottom: spacing.lg,
        },
        version: {
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center',
            marginBottom: spacing.xl,
        },
        // Modal styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.lg,
        },
        modalContent: {
            backgroundColor: colors.surfaceSolid || '#1a1a2e',
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            width: '100%',
            maxWidth: 320,
            borderWidth: 1,
            borderColor: colors.border,
        },
        modalTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: spacing.lg,
        },
        languageOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
        },
        languageOptionSelected: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary,
        },
        languageOptionText: {
            color: colors.textPrimary,
            fontSize: 16,
        },
        languageOptionTextSelected: {
            color: colors.primary,
            fontWeight: '600',
        },
        checkmark: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkmarkText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
        },
        modalCancelButton: {
            padding: spacing.md,
            alignItems: 'center',
            marginTop: spacing.sm,
        },
        modalCancelText: {
            color: colors.textMuted,
            fontSize: 16,
        },
    });
