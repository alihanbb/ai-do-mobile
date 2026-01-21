import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useAuthStore } from '../../src/features/auth/presentation/stores/useAuthStore';

export default function ForgotPasswordScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            setError('Lütfen e-posta adresinizi girin');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const success = await useAuthStore.getState().forgotPassword(email);

            if (success) {
                setIsSent(true);
            } else {
                setError(useAuthStore.getState().error || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Beklenmeyen bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Background Gradient */}
                <LinearGradient
                    colors={['rgba(124, 58, 237, 0.15)', 'transparent']}
                    style={styles.gradient}
                />

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/icon.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Reset Password Form */}
                    <Card
                        variant='default'
                        padding='lg'
                        style={[
                            styles.formCard,
                            { backgroundColor: colors.card, borderColor: colors.border }
                        ]}
                    >
                        {!isSent ? (
                            <>
                                <Text style={styles.formTitle}>Şifremi Unuttum</Text>
                                <Text style={styles.formDescription}>
                                    E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                                </Text>

                                {error && <Text style={styles.errorText}>{error}</Text>}

                                <Input
                                    label='E-posta'
                                    placeholder='ornek@email.com'
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError('');
                                    }}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    icon={<Mail size={18} color={colors.textMuted} />}
                                    containerStyle={styles.inputContainer}
                                />

                                <Button
                                    title='Sıfırlama Bağlantısı Gönder'
                                    onPress={handleResetPassword}
                                    loading={isLoading}
                                    fullWidth
                                    icon={<Send size={18} color={colors.textPrimary} />}
                                    style={styles.button}
                                />
                            </>
                        ) : (
                            <>
                                <View style={styles.successIcon}>
                                    <LinearGradient
                                        colors={[colors.success, '#16a34a']}
                                        style={styles.successIconBg}
                                    >
                                        <Mail size={32} color={colors.textPrimary} />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.formTitle}>E-posta Gönderildi!</Text>
                                <Text style={styles.formDescription}>
                                    {email} adresine şifre sıfırlama bağlantısı gönderdik.
                                    Lütfen gelen kutunuzu kontrol edin.
                                </Text>

                                <Button
                                    title='Giriş Sayfasına Dön'
                                    onPress={() => router.replace('/(auth)/login')}
                                    fullWidth
                                    style={styles.button}
                                />
                            </>
                        )}
                    </Card>

                    {/* Back to Login Link */}
                    {!isSent && (
                        <TouchableOpacity
                            style={styles.backToLogin}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.backToLoginText}>Giriş sayfasına geri dön</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
    },
    backButton: {
        position: 'absolute',
        top: spacing.xl + 20,
        left: spacing.lg,
        zIndex: 1,
        padding: spacing.sm,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    formCard: {
        marginBottom: spacing.xl,
    },
    formTitle: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    formDescription: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.xl,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    button: {
        marginTop: spacing.md,
    },
    successIcon: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    successIconBg: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backToLogin: {
        alignItems: 'center',
    },
    backToLoginText: {
        color: colors.primary,
        fontSize: 14,
    },
});
