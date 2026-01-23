import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';

export default function TermsScreen() {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { t } = useTranslation();

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: t('legal.termsOfService.title'),
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <FileText size={48} color={colors.primary} />
                    <Text style={styles.headerTitle}>{t('legal.termsOfService.title')}</Text>
                    <Text style={styles.lastUpdated}>{t('legal.termsOfService.lastUpdated')}</Text>
                </View>

                <Card variant="default" padding="lg" style={styles.card}>
                    <Text style={styles.policyText}>
                        {t('legal.termsOfService.content')}
                    </Text>
                </Card>

                <View style={styles.footerSpacer} />
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
        marginTop: spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    lastUpdated: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    card: {
        marginBottom: spacing.lg,
    },
    policyText: {
        fontSize: 15,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    footerSpacer: {
        height: spacing.xl,
    }
});
