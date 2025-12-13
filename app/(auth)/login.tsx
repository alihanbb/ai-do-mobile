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
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            setError('');
            await login(email || 'test@test.com', password || '123456');
            router.replace('/(tabs)');
        } catch (err) {
            setError('Giriş başarısız');
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log('Google login pressed');
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

                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.logo}
                        >
                            <Sparkles size={32} color={colors.textPrimary} />
                        </LinearGradient>
                        <Text style={styles.appName}>AI-Do</Text>
                        <Text style={styles.tagline}>Geleceğin Üretkenlik Asistanı</Text>
                    </View>

                    {/* Login Form */}
                    <Card variant='default' padding='lg' style={styles.formCard}>
                        <Text style={styles.formTitle}>Hoş Geldiniz</Text>

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

                        <Input
                            label='Şifre'
                            placeholder='Şifreniz'
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            secureTextEntry
                            icon={<Lock size={18} color={colors.textMuted} />}
                            containerStyle={styles.inputContainer}
                        />

                        <Button
                            title='Giriş Yap'
                            onPress={handleLogin}
                            loading={isLoading}
                            fullWidth
                            style={styles.button}
                        />

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => router.push('/(auth)/forgot-password')}
                        >
                            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                        </TouchableOpacity>
                    </Card>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.registerLink}>Kayıt Olun</Text>
                        </TouchableOpacity>
                    </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    logo: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    appName: {
        color: colors.textPrimary,
        fontSize: 32,
        fontWeight: 'bold',
    },
    tagline: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: spacing.xs,
    },
    formCard: {
        marginBottom: spacing.xl,
    },
    formTitle: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
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
    forgotPassword: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: colors.primary,
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        color: colors.textMuted,
        fontSize: 14,
        marginHorizontal: spacing.md,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceSolid,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        gap: spacing.md,
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    googleButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '500',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    registerLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
