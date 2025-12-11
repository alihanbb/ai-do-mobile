import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, Mail, Lock, User } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validateForm = (): boolean => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Lütfen tüm alanları doldurun');
            return false;
        }

        if (!email.includes('@')) {
            setError('Geçerli bir e-posta adresi girin');
            return false;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        try {
            await register(name, email, password);
            router.replace('/(tabs)');
        } catch (err) {
            setError('Kayıt başarısız. Lütfen tekrar deneyin.');
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
                    colors={['rgba(8, 145, 178, 0.15)', 'transparent']}
                    style={styles.gradient}
                />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={[colors.secondary, colors.primary]}
                                style={styles.logo}
                            >
                                <Sparkles size={32} color={colors.textPrimary} />
                            </LinearGradient>
                            <Text style={styles.appName}>AI-Do</Text>
                            <Text style={styles.tagline}>Yeni Hesap Oluştur</Text>
                        </View>

                        {/* Register Form */}
                        <Card variant='default' padding='lg' style={styles.formCard}>
                            <Text style={styles.formTitle}>Kayıt Ol</Text>

                            {error && <Text style={styles.errorText}>{error}</Text>}

                            <Input
                                label='Ad Soyad'
                                placeholder='Adınız Soyadınız'
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setError('');
                                }}
                                autoCapitalize='words'
                                icon={<User size={18} color={colors.textMuted} />}
                                containerStyle={styles.inputContainer}
                            />

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
                                placeholder='En az 6 karakter'
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError('');
                                }}
                                secureTextEntry
                                icon={<Lock size={18} color={colors.textMuted} />}
                                containerStyle={styles.inputContainer}
                            />

                            <Input
                                label='Şifre Tekrar'
                                placeholder='Şifrenizi tekrar girin'
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    setError('');
                                }}
                                secureTextEntry
                                icon={<Lock size={18} color={colors.textMuted} />}
                                containerStyle={styles.inputContainer}
                            />

                            <Button
                                title='Kayıt Ol'
                                onPress={handleRegister}
                                loading={isLoading}
                                fullWidth
                                style={styles.button}
                            />
                        </Card>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text style={styles.loginLink}>Giriş Yapın</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: spacing.xxxl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    appName: {
        color: colors.textPrimary,
        fontSize: 28,
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
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: spacing.md,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    inputContainer: {
        marginBottom: spacing.md,
    },
    button: {
        marginTop: spacing.lg,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    loginLink: {
        color: colors.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
});
