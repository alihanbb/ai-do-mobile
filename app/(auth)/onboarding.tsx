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
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import {
    Sparkles,
    Brain,
    Zap,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: readonly [string, string];
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        icon: <Sparkles size={64} color={colors.textPrimary} />,
        title: "AI-Do'ya Hoş Geldiniz",
        description: 'Yapay zeka destekli görev yöneticisi ile verimliliğinizi artırın. Görevlerinizi akıllıca organize edin.',
        gradient: [colors.primary, colors.primaryDark] as const,
    },
    {
        id: '2',
        icon: <Brain size={64} color={colors.textPrimary} />,
        title: 'Akıllı Görev Yönetimi',
        description: 'AI, görevlerinizi analiz eder ve size en verimli zamanları önerir. Enerji seviyenize göre planlama yapar.',
        gradient: [colors.secondary, colors.secondaryDark] as const,
    },
    {
        id: '3',
        icon: <Zap size={64} color={colors.textPrimary} />,
        title: 'Başlamaya Hazır mısınız?',
        description: 'Doğal dil ile görev ekleyin, sesli komutlar kullanın ve hedeflerinize ulaşın.',
        gradient: [colors.accent, colors.accentDark] as const,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { completeOnboarding } = useAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleComplete();
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
        await completeOnboarding();
        router.replace('/(auth)/login');
    };

    const currentSlide = slides[currentIndex];

    return (
        <SafeAreaView style={styles.container}>
            {/* Skip Button */}
            <View style={styles.header}>
                <Pressable
                    onPress={handleSkip}
                    style={({ pressed }) => [
                        styles.skipButton,
                        pressed && styles.buttonPressed
                    ]}
                >
                    <Text style={styles.skipText}>Atla</Text>
                </Pressable>
            </View>

            {/* Current Slide */}
            <ScrollView
                contentContainerStyle={styles.slideContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.slide}>
                    <LinearGradient
                        colors={['rgba(124, 58, 237, 0.1)', 'transparent']}
                        style={styles.slideGradient}
                    />

                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={currentSlide.gradient}
                            style={styles.iconBackground}
                        >
                            {currentSlide.icon}
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>{currentSlide.title}</Text>
                    <Text style={styles.description}>{currentSlide.description}</Text>

                    {currentIndex === slides.length - 1 && (
                        <View style={styles.features}>
                            {['Doğal Dil İşleme', 'Enerji Analizi', 'Akıllı Öneriler'].map((feature, i) => (
                                <View key={i} style={styles.featureItem}>
                                    <CheckCircle2 size={16} color={colors.success} />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {/* Navigation Buttons */}
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
                        {currentIndex === slides.length - 1 ? (
                            <Button
                                title="Başlayın"
                                onPress={handleComplete}
                                fullWidth
                                icon={<ChevronRight size={20} color={colors.textPrimary} />}
                            />
                        ) : (
                            <Button
                                title="Devam"
                                onPress={handleNext}
                                fullWidth
                                icon={<ChevronRight size={20} color={colors.textPrimary} />}
                            />
                        )}
                    </View>
                </View>
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
        justifyContent: 'flex-end',
        padding: spacing.lg,
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
    },
    buttonPressed: {
        opacity: 0.7,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
        minHeight: 400,
    },
    slideGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    iconContainer: {
        marginBottom: spacing.xxxl,
    },
    iconBackground: {
        width: 120,
        height: 120,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    description: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.md,
    },
    features: {
        marginTop: spacing.xxl,
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    featureText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    bottomSection: {
        paddingHorizontal: spacing.xxl,
        paddingBottom: spacing.xxxl,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xxl,
        gap: spacing.sm,
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
