import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Globe, Mail, Info } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';

export default function AboutScreen() {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { t } = useTranslation();

    const handleWebsitePress = () => {
        Linking.openURL('https://www.aido.app');
    };

    const handleEmailPress = () => {
        Linking.openURL('mailto:destek@aido.app');
    };

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: t('about.title'),
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Info size={40} color="#fff" />
                    </View>
                    <Text style={styles.appName}>AI-Do</Text>
                    <Text style={styles.version}>{t('about.version')} 1.0.0</Text>
                </View>

                <Card variant="default" padding="lg" style={styles.descriptionCard}>
                    <Text style={styles.description}>
                        {t('about.description')}
                    </Text>
                </Card>

                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.linkButton} onPress={handleWebsitePress}>
                        <Globe size={20} color={colors.primary} />
                        <View style={styles.linkContent}>
                            <Text style={styles.linkLabel}>{t('about.website')}</Text>
                            <Text style={styles.linkValue}>{t('about.websiteUrl')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={handleEmailPress}>
                        <Mail size={20} color={colors.primary} />
                        <View style={styles.linkContent}>
                            <Text style={styles.linkLabel}>{t('about.contact')}</Text>
                            <Text style={styles.linkValue}>{t('about.contactEmail')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2025 AI-Do. All rights reserved.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: colors.primary,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    version: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    descriptionCard: {
        marginBottom: spacing.xl,
    },
    description: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
        textAlign: 'center',
    },
    linksContainer: {
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        gap: spacing.lg,
    },
    linkContent: {
        flex: 1,
    },
    linkLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    linkValue: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: spacing.xl,
    },
    copyright: {
        fontSize: 12,
        color: colors.textMuted,
    },
});
