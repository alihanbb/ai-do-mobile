import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Pressable,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import {
    Sparkles,
    Brain,
    Zap,
    CheckSquare,
    Timer,
    Calendar,
    TrendingUp,
    ChevronRight,
    ChevronLeft,
    UserPlus,
    LogIn,
} from 'lucide-react-native';
import {
    MockTaskCard,
    MockTimerPreview,
    MockAICard,
    MockCalendarPreview,
    FeatureList,
} from '../../components/onboarding';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    type: 'welcome' | 'tasks' | 'timer' | 'ai' | 'analytics' | 'getstarted';
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    gradient: readonly [string, string];
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        type: 'welcome',
        icon: <Sparkles size={64} color={colors.textPrimary} />,
        title: "AI-Do'ya Hoş Geldiniz",
        subtitle: 'Yapay zeka destekli akıllı görev yöneticisi',
        gradient: [colors.primary, colors.primaryDark] as const,
    },
    {
        id: '2',
        type: 'tasks',
        icon: <CheckSquare size={48} color={colors.textPrimary} />,
        title: 'Akıllı Görev Yönetimi',
        subtitle: 'Görevlerinizi düzenli ve verimli tutun',
        gradient: ['#3b82f6', '#2563eb'] as const,
    },
    {
        id: '3',
        type: 'timer',
        icon: <Timer size={48} color={colors.textPrimary} />,
        title: 'Pomodoro & Odaklanma',
        subtitle: 'Zamanınızı verimli kullanın',
        gradient: ['#ef4444', '#dc2626'] as const,
    },
    {
        id: '4',
        type: 'ai',
        icon: <Brain size={48} color={colors.textPrimary} />,
        title: 'AI Destekli Özellikler',
        subtitle: 'Yapay zeka size yardımcı olsun',
        gradient: [colors.primary, colors.accent] as const,
    },
    {
        id: '5',
        type: 'analytics',
        icon: <TrendingUp size={48} color={colors.textPrimary} />,
        title: 'Takvim & İstatistikler',
        subtitle: 'İlerlemenizi takip edin',
        gradient: ['#22c55e', '#16a34a'] as const,
    },
    {
        id: '6',
        type: 'getstarted',
        icon: <Zap size={64} color={colors.textPrimary} />,
        title: 'Başlamaya Hazır mısınız?',
        subtitle: 'Hemen ücretsiz hesabınızı oluşturun',
        gradient: [colors.accent, colors.accentDark] as const,
    },
];

const taskFeatures = [
    'Kategoriler ile düzenleme',
    'Öncelik seviyeleri',
    'Alt görevler oluşturma',
    'Etiketler ve hatırlatıcılar',
];

const timerFeatures = [
    'Pomodoro tekniği',
    'Kronometre modu',
    'Özelleştirilebilir presetler',
    'Odaklanma istatistikleri',
];

const aiFeatures = [
    'Akıllı görev önerileri',
    'Doğal dil ile görev ekleme',
    'Enerji seviyesi analizi',
    'Otomatik zamanlama',
];

const analyticsFeatures = [
    'Günlük/haftalık görünüm',
    'Tamamlama oranları',
    'Trend analizleri',
    'Verimlilik raporları',
];

const allFeatures = [
    'AI destekli görev yönetimi',
    'Pomodoro & odaklanma araçları',
    'Detaylı istatistikler',
    'Kategori ve öncelik sistemi',
    'Doğal dil ile görev ekleme',
    'Kişiselleştirilmiş öneriler',
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        // Mark onboarding as seen for this session
        if ((global as any).markOnboardingSeen) {
            (global as any).markOnboardingSeen();
        }
        router.replace('/(auth)/login');
    };

    const handleRegister = async () => {
        // Mark onboarding as seen for this session
        if ((global as any).markOnboardingSeen) {
            (global as any).markOnboardingSeen();
        }
        router.replace('/(auth)/register');
    };

    const currentSlide = slides[currentIndex];
    const isLastSlide = currentIndex === slides.length - 1;

    const renderSlideContent = () => {
        switch (currentSlide.type) {
            case 'welcome':
                return (
                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeDescription}>
                            Görevlerinizi akıllıca yönetin, zamanınızı verimli kullanın ve
                            hedeflerinize ulaşın. AI-Do, yapay zeka ile desteklenen modern
                            bir görev yönetim uygulamasıdır.
                        </Text>
                        <View style={styles.welcomeHighlights}>
                            <View style={styles.highlightItem}>
                                <CheckSquare size={24} color={colors.primary} />
                                <Text style={styles.highlightText}>Görev Yönetimi</Text>
                            </View>
                            <View style={styles.highlightItem}>
                                <Timer size={24} color={colors.secondary} />
                                <Text style={styles.highlightText}>Pomodoro Timer</Text>
                            </View>
                            <View style={styles.highlightItem}>
                                <Brain size={24} color={colors.accent} />
                                <Text style={styles.highlightText}>AI Önerileri</Text>
                            </View>
                        </View>
                    </View>
                );

            case 'tasks':
                return (
                    <View style={styles.featureContent}>
                        <MockTaskCard />
                        <View style={styles.featureListContainer}>
                            <FeatureList features={taskFeatures} />
                        </View>
                    </View>
                );

            case 'timer':
                return (
                    <View style={styles.featureContent}>
                        <MockTimerPreview />
                        <View style={styles.featureListContainer}>
                            <FeatureList features={timerFeatures} color={colors.primary} />
                        </View>
                    </View>
                );

            case 'ai':
                return (
                    <View style={styles.featureContent}>
                        <View style={styles.aiCardsContainer}>
                            <MockAICard type="energy" />
                            <MockAICard type="time" />
                        </View>
                        <View style={styles.featureListContainer}>
                            <FeatureList features={aiFeatures} color={colors.primary} />
                        </View>
                    </View>
                );

            case 'analytics':
                return (
                    <View style={styles.featureContent}>
                        <MockCalendarPreview />
                        <View style={styles.featureListContainer}>
                            <FeatureList features={analyticsFeatures} color={colors.success} />
                        </View>
                    </View>
                );

            case 'getstarted':
                return (
                    <View style={styles.getStartedContent}>
                        <View style={styles.allFeaturesContainer}>
                            <Text style={styles.allFeaturesTitle}>Tüm Özellikler</Text>
                            <FeatureList features={allFeatures} />
                        </View>
                        <View style={styles.authButtons}>
                            <Button
                                title="Hesap Oluştur"
                                onPress={handleRegister}
                                fullWidth
                                icon={<UserPlus size={20} color={colors.textPrimary} />}
                            />
                            <Button
                                title="Giriş Yap"
                                onPress={handleComplete}
                                variant="secondary"
                                fullWidth
                                icon={<LogIn size={20} color={colors.primary} />}
                            />
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.pageIndicator}>
                    <Text style={styles.pageText}>{currentIndex + 1}/{slides.length}</Text>
                </View>
                {!isLastSlide && (
                    <Pressable
                        onPress={handleSkip}
                        style={({ pressed }) => [
                            styles.skipButton,
                            pressed && styles.buttonPressed
                        ]}
                    >
                        <Text style={styles.skipText}>Atla</Text>
                    </Pressable>
                )}
            </View>

            {/* Slide Content */}
            <ScrollView
                contentContainerStyle={styles.slideContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.slide}>
                    <LinearGradient
                        colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
                        style={styles.slideGradient}
                    />

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={currentSlide.gradient}
                            style={styles.iconBackground}
                        >
                            {currentSlide.icon}
                        </LinearGradient>
                    </View>

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>{currentSlide.title}</Text>
                    {currentSlide.subtitle && (
                        <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
                    )}

                    {/* Dynamic Content */}
                    <View style={styles.contentContainer}>
                        {renderSlideContent()}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <Pressable
                            key={index}
                            onPress={() => setCurrentIndex(index)}
                            style={[
                                styles.dot,
                                index === currentIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {/* Navigation Buttons */}
                {!isLastSlide && (
                    <View style={styles.navigationRow}>
                        {currentIndex > 0 && (
                            <Pressable
                                onPress={handlePrev}
                                style={({ pressed }) => [
                                    styles.navButton,
                                    pressed && styles.buttonPressed
                                ]}
                            >
                                <ChevronLeft size={24} color={colors.textSecondary} />
                            </Pressable>
                        )}

                        <View style={styles.mainButtonContainer}>
                            <Button
                                title="Devam"
                                onPress={handleNext}
                                fullWidth
                                icon={<ChevronRight size={20} color={colors.textPrimary} />}
                            />
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
    },
    pageIndicator: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    pageText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '500',
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
    },
    buttonPressed: {
        opacity: 0.7,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    skipText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    slideContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
    },
    slideGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    iconBackground: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    contentContainer: {
        width: '100%',
        marginTop: spacing.lg,
    },
    // Welcome slide
    welcomeContent: {
        alignItems: 'center',
    },
    welcomeDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    welcomeHighlights: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
    },
    highlightItem: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    highlightText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    // Feature slides
    featureContent: {
        gap: spacing.xl,
    },
    featureListContainer: {
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    // AI slide
    aiCardsContainer: {
        gap: spacing.md,
    },
    // Get Started slide
    getStartedContent: {
        gap: spacing.xl,
    },
    allFeaturesContainer: {
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    allFeaturesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    authButtons: {
        gap: spacing.md,
    },
    // Bottom section
    bottomSection: {
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.xxxl,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
        gap: spacing.xs,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: colors.primary,
    },
    dotInactive: {
        width: 8,
        backgroundColor: colors.textMuted,
        opacity: 0.3,
    },
    navigationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    navButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceSolid,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mainButtonContainer: {
        flex: 1,
    },
});
