import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    User,
    Bell,
    Moon,
    Sun,
    Globe,
    Clock,
    Zap,
    LogOut,
    ChevronRight,
    Palette,
} from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const { isDark, toggleTheme, mode } = useThemeStore();
    const colors = getColors(isDark);

    const menuItems = [
        {
            icon: <Bell size={20} color={colors.textSecondary} />,
            label: 'Bildirimler',
            value: 'Açık',
            type: 'navigate' as const,
        },
        {
            icon: <Globe size={20} color={colors.textSecondary} />,
            label: 'Dil',
            value: 'Türkçe',
            type: 'navigate' as const,
        },
        {
            icon: <Clock size={20} color={colors.textSecondary} />,
            label: 'Çalışma Saatleri',
            value: '09:00 - 18:00',
            type: 'navigate' as const,
        },
        {
            icon: <Zap size={20} color={colors.textSecondary} />,
            label: 'Enerji Takibi',
            value: 'Açık',
            type: 'navigate' as const,
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
                <Text style={styles.title}>Profil</Text>

                {/* Profile Card */}
                <Card variant='default' padding='lg' style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0) || 'A'}
                            </Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'ornek@email.com'}</Text>
                </Card>

                {/* Theme Toggle Card */}
                <Card variant='default' padding='none' style={styles.themeCard}>
                    <View style={styles.themeItem}>
                        <View style={styles.menuItemLeft}>
                            {isDark ? (
                                <Moon size={20} color={colors.primary} />
                            ) : (
                                <Sun size={20} color={colors.warning} />
                            )}
                            <View>
                                <Text style={styles.menuItemLabel}>
                                    {isDark ? 'Karanlık Mod' : 'Aydınlık Mod'}
                                </Text>
                                <Text style={styles.themeHint}>
                                    Tema değiştirmek için dokunun
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{
                                false: colors.border,
                                true: colors.primary + '50'
                            }}
                            thumbColor={isDark ? colors.primary : colors.textMuted}
                        />
                    </View>
                </Card>

                {/* Settings */}
                <Card variant='default' padding='none' style={styles.settingsCard}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuItem,
                                index < menuItems.length - 1 && styles.menuItemBorder,
                            ]}
                        >
                            <View style={styles.menuItemLeft}>
                                {item.icon}
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuItemRight}>
                                <Text style={styles.menuItemValue}>{item.value}</Text>
                                <ChevronRight size={18} color={colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Logout */}
                <Button
                    title='Çıkış Yap'
                    onPress={logout}
                    variant='ghost'
                    icon={<LogOut size={18} color={colors.error} />}
                    fullWidth
                    style={styles.logoutButton}
                />

                {/* App Version */}
                <Text style={styles.version}>AI-Do v1.0.0</Text>
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
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarText: {
            color: colors.textPrimary,
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
        themeCard: {
            marginBottom: spacing.lg,
        },
        themeItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
        },
        themeHint: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 2,
        },
        settingsCard: {
            marginBottom: spacing.xl,
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
        },
        menuItemLabel: {
            color: colors.textPrimary,
            fontSize: 16,
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
            marginBottom: spacing.xl,
        },
        version: {
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center',
        },
    });

