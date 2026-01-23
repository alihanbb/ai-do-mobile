import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, X } from 'lucide-react-native';
import { useThemeStore } from '../../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../../constants/colors';
import Constants from 'expo-constants';

interface CompletionModalProps {
    visible: boolean;
    onClose: () => void;
    durationMinutes: number;
    focusMode: string;
}

const { width } = Dimensions.get('window');

export const CompletionModal: React.FC<CompletionModalProps> = ({
    visible,
    onClose,
    durationMinutes,
    focusMode
}) => {
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);
    const styles = createStyles(colors);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <X size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <CheckCircle2 size={64} color={colors.success} />
                        </View>

                        <Text style={styles.title}>
                            {t('pomo.congratulations') || 'Tebrikler!'}
                        </Text>

                        <Text style={styles.message}>
                            {t('pomo.completionMessage', { duration: durationMinutes }) ||
                                `${durationMinutes} dakikalık odaklanma oturumunu başarıyla tamamladınız.`}
                        </Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>+1</Text>
                                <Text style={styles.statLabel}>
                                    {focusMode === 'pomodoro' ? 'Pomo' : 'Session'}
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{durationMinutes}m</Text>
                                <Text style={styles.statLabel}>Focus</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>
                                {t('common.continue') || 'Devam Et'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        padding: spacing.sm,
        zIndex: 1,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.lg,
        padding: spacing.lg,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.full,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xl,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: colors.border,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.full,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
