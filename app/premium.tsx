import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/themeStore';
import { getColors, spacing, borderRadius } from '../constants/colors';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
    ArrowLeft,
    Crown,
    Check,
    Sparkles,
    Brain,
    Infinity,
    Clock,
    Users,
    Shield,
    Zap,
} from 'lucide-react-native';

type PlanType = 'monthly' | 'yearly';

const PLANS = {
    monthly: {
        price: '₺49.99',
        period: '/ay',
        savings: null,
    },
    yearly: {
        price: '₺399.99',
        period: '/yıl',
        savings: '33% tasarruf',
    },
};

const FEATURES = [
    {
        icon: Brain,
        title: 'Gelişmiş AI Asistan',
        description: 'Görev önceliklendirme ve akıllı öneriler',
    },
    {
        icon: Infinity,
        title: 'Sınırsız Görev',
        description: 'Görev limiti olmadan çalışın',
    },
    {
        icon: Clock,
        title: 'Zaman Takibi',
        description: 'Detaylı zaman ve verimlilik raporları',
    },
    {
        icon: Users,
        title: 'Ekip İşbirliği',
        description: 'Görevleri paylaşın ve birlikte çalışın',
    },
    {
        icon: Shield,
        title: 'Öncelikli Destek',
        description: '7/24 öncelikli müşteri desteği',
    },
    {
        icon: Zap,
        title: 'Erken Erişim',
        description: 'Yeni özelliklere ilk siz erişin',
    },
];

export default function PremiumScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

    const styles = createStyles(colors);

    const handleSubscribe = () => {
        // TODO: Integrate with payment provider
        alert('Ödeme entegrasyonu yakında!');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                >
                    <View style={styles.heroIconContainer}>
                        <Crown size={48} color="#fff" />
                    </View>
                    <Text style={styles.heroTitle}>AI-Do Premium</Text>
                    <Text style={styles.heroSubtitle}>
                        Verimliliğinizi maksimuma çıkarın
                    </Text>
                    <View style={styles.sparkleRow}>
                        <Sparkles size={16} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.sparkleText}>Tüm özelliklere sınırsız erişim</Text>
                        <Sparkles size={16} color="rgba(255,255,255,0.8)" />
                    </View>
                </LinearGradient>

                {/* Plan Selection */}
                <View style={styles.plansContainer}>
                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            selectedPlan === 'monthly' && styles.planCardSelected,
                        ]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View style={styles.planRadio}>
                            {selectedPlan === 'monthly' && (
                                <View style={styles.planRadioInner} />
                            )}
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={styles.planTitle}>Aylık</Text>
                            <Text style={styles.planPrice}>
                                {PLANS.monthly.price}
                                <Text style={styles.planPeriod}>{PLANS.monthly.period}</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.planCard,
                            selectedPlan === 'yearly' && styles.planCardSelected,
                        ]}
                        onPress={() => setSelectedPlan('yearly')}
                    >
                        {PLANS.yearly.savings && (
                            <View style={styles.savingsBadge}>
                                <Text style={styles.savingsText}>{PLANS.yearly.savings}</Text>
                            </View>
                        )}
                        <View style={styles.planRadio}>
                            {selectedPlan === 'yearly' && (
                                <View style={styles.planRadioInner} />
                            )}
                        </View>
                        <View style={styles.planInfo}>
                            <Text style={styles.planTitle}>Yıllık</Text>
                            <Text style={styles.planPrice}>
                                {PLANS.yearly.price}
                                <Text style={styles.planPeriod}>{PLANS.yearly.period}</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Features */}
                <Text style={styles.sectionTitle}>Premium Özellikler</Text>
                <Card variant="default" padding="none" style={styles.featuresCard}>
                    {FEATURES.map((feature, index) => (
                        <View
                            key={index}
                            style={[
                                styles.featureItem,
                                index < FEATURES.length - 1 && styles.featureItemBorder,
                            ]}
                        >
                            <View style={styles.featureIconContainer}>
                                <feature.icon size={24} color={colors.primary} />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>
                                    {feature.description}
                                </Text>
                            </View>
                            <Check size={20} color={colors.success} />
                        </View>
                    ))}
                </Card>

                {/* CTA Button */}
                <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaGradient}
                >
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={handleSubscribe}
                        activeOpacity={0.8}
                    >
                        <Crown size={20} color="#fff" />
                        <Text style={styles.ctaText}>Premium'a Geç</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Terms */}
                <Text style={styles.terms}>
                    Aboneliğiniz otomatik olarak yenilenir. İstediğiniz zaman iptal edebilirsiniz.
                    Ödeme işlemi güvenli bağlantı üzerinden gerçekleştirilir.
                </Text>
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
        heroCard: {
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
            alignItems: 'center',
            marginBottom: spacing.xl,
        },
        heroIconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
        },
        heroTitle: {
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: spacing.xs,
        },
        heroSubtitle: {
            color: 'rgba(255,255,255,0.9)',
            fontSize: 16,
            marginBottom: spacing.md,
        },
        sparkleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        sparkleText: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
        },
        plansContainer: {
            flexDirection: 'row',
            gap: spacing.md,
            marginBottom: spacing.xl,
        },
        planCard: {
            flex: 1,
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            borderWidth: 2,
            borderColor: colors.border,
            position: 'relative',
        },
        planCardSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '10',
        },
        savingsBadge: {
            position: 'absolute',
            top: -10,
            right: 10,
            backgroundColor: colors.success,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.md,
        },
        savingsText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
        },
        planRadio: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
        },
        planRadioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.primary,
        },
        planInfo: {},
        planTitle: {
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: spacing.xs,
        },
        planPrice: {
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: 'bold',
        },
        planPeriod: {
            color: colors.textMuted,
            fontSize: 14,
            fontWeight: 'normal',
        },
        sectionTitle: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: spacing.md,
        },
        featuresCard: {
            marginBottom: spacing.xl,
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.lg,
            gap: spacing.md,
        },
        featureItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        featureIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary + '15',
            alignItems: 'center',
            justifyContent: 'center',
        },
        featureTextContainer: {
            flex: 1,
        },
        featureTitle: {
            color: colors.textPrimary,
            fontSize: 15,
            fontWeight: '600',
        },
        featureDescription: {
            color: colors.textMuted,
            fontSize: 13,
            marginTop: 2,
        },
        ctaGradient: {
            borderRadius: borderRadius.xl,
            marginBottom: spacing.lg,
        },
        ctaButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: spacing.lg,
            gap: spacing.sm,
        },
        ctaText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        terms: {
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center',
            lineHeight: 18,
        },
    });
