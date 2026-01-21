import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Platform,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/themeStore';
import { getColors, spacing, borderRadius } from '../constants/colors';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../src/features/auth/infrastructure/api/userApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    ArrowLeft,
    Camera,
    User,
    Mail,
    Save,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);

    const [name, setName] = useState(user?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const styles = createStyles(colors);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert(t('common.error'), t('profile.enterNameError') || 'Lütfen adınızı girin');
            return;
        }

        setIsSaving(true);
        try {
            const result = await userApi.updateProfile({ name: name.trim() });

            if (result.success && result.data) {
                setUser({
                    ...user!,
                    name: result.data.name,
                });
                Alert.alert(t('common.success'), t('profile.updateSuccess') || 'Profiliniz güncellendi', [
                    { text: t('common.ok') || 'Tamam', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert(t('common.error'), result.error?.message || t('profile.updateError') || 'Profil güncellenemedi');
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('common.genericError') || 'Bir sorun oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile.editProfile')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>
                                {name?.charAt(0)?.toUpperCase() || 'A'}
                            </Text>
                        </LinearGradient>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarHint}>{t('profile.changePhoto') || 'Fotoğrafı değiştirmek için dokunun'}</Text>
                </View>

                {/* Form */}
                <Card variant="default" padding="lg" style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('auth.name')}</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color={colors.textMuted} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder={t('auth.namePlaceholder')}
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('auth.email')}</Text>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Mail size={20} color={colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: colors.textMuted }]}
                                value={user?.email || ''}
                                editable={false}
                                placeholder={t('auth.email')}
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>
                        <Text style={styles.inputHint}>{t('profile.emailImmutable') || 'E-posta adresi değiştirilemez'}</Text>
                    </View>
                </Card>

                {/* Save Button */}
                <Button
                    title={isSaving ? t('common.saving') || 'Kaydediliyor...' : t('common.save')}
                    onPress={handleSave}
                    fullWidth
                    disabled={isSaving || !name.trim()}
                    icon={isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Save size={18} color="#fff" />}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.md,
            paddingTop: Platform.OS === 'android' ? spacing.md + (StatusBar.currentHeight || 24) : spacing.sm,
            paddingBottom: spacing.md,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: spacing.lg,
        },
        avatarSection: {
            alignItems: 'center',
            marginBottom: spacing.xl,
        },
        avatarContainer: {
            position: 'relative',
            marginBottom: spacing.sm,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarText: {
            color: '#fff',
            fontSize: 40,
            fontWeight: 'bold',
        },
        cameraButton: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: colors.background,
        },
        avatarHint: {
            color: colors.textMuted,
            fontSize: 12,
        },
        formCard: {
            marginBottom: spacing.xl,
        },
        inputGroup: {
            marginBottom: spacing.lg,
        },
        label: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500',
            marginBottom: spacing.sm,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: spacing.md,
            gap: spacing.sm,
        },
        inputDisabled: {
            opacity: 0.6,
        },
        input: {
            flex: 1,
            color: colors.textPrimary,
            fontSize: 16,
            paddingVertical: spacing.md,
        },
        inputHint: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: spacing.xs,
        },
    });
