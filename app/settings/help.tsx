import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Mail, ExternalLink, HelpCircle } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { t } = useTranslation();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:destek@aido.app?subject=Destek Talebi');
    };

    const faqItems = (t('help.questions', { returnObjects: true }) as any[]) || [];

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerTitle: t('help.title'),
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <HelpCircle size={48} color={colors.primary} />
                    <Text style={styles.headerTitle}>{t('help.title')}</Text>
                    <Text style={styles.headerSubtitle}>{t('help.faq')}</Text>
                </View>

                <View style={styles.section}>
                    {faqItems.map((item, index) => (
                        <Card
                            key={index}
                            variant="default"
                            padding="none"
                            style={styles.faqCard}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.questionHeader,
                                    expandedId === index && styles.questionHeaderExpanded
                                ]}
                                onPress={() => toggleExpand(index)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.questionText}>{item.q}</Text>
                                {expandedId === index ? (
                                    <ChevronUp size={20} color={colors.textMuted} />
                                ) : (
                                    <ChevronDown size={20} color={colors.textMuted} />
                                )}
                            </TouchableOpacity>

                            {expandedId === index && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answerText}>{item.a}</Text>
                                </View>
                            )}
                        </Card>
                    ))}
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>{t('help.contactSupport')}</Text>
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={handleContactSupport}
                    >
                        <Mail size={20} color="#fff" />
                        <Text style={styles.contactButtonText}>{t('help.contactSupport')}</Text>
                    </TouchableOpacity>
                </View>

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
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    faqCard: {
        marginBottom: spacing.md,
        overflow: 'hidden',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    questionHeaderExpanded: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing.sm,
    },
    answerContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface + '80',
    },
    answerText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    contactSection: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
        width: '100%',
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerSpacer: {
        height: spacing.xl * 2,
    }
});
