import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { FocusPresetProps, PRESET_ICONS } from '../../src/features/focus/domain/entities/FocusPreset';
import { FocusMode } from '../../src/features/focus/domain/entities/FocusSession';
import { useTranslation } from 'react-i18next';

interface PresetModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (preset: FocusPresetProps) => void;
    editPreset?: FocusPresetProps | null;
}

export const PresetModal: React.FC<PresetModalProps> = ({
    visible,
    onClose,
    onSave,
    editPreset = null,
}) => {
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);

    const [name, setName] = useState(editPreset?.name || '');
    const [icon, setIcon] = useState(editPreset?.icon || '😊');
    const [mode, setMode] = useState<FocusMode>(editPreset?.mode || 'pomodoro');
    const [duration, setDuration] = useState(editPreset?.durationMinutes?.toString() || '25');

    const handleSave = () => {
        const preset: FocusPresetProps = {
            id: editPreset?.id || Date.now().toString(),
            name: name || t('pomo.modal.defaultName'),
            icon,
            mode,
            durationMinutes: parseInt(duration) || 25,
            color: '#7c3aed',
            isDefault: false,
            sortOrder: 0,
        };
        onSave(preset);
        onClose();
    };

    const styles = createStyles(colors);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {t('pomo.modal.title')}
                        </Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Check size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('pomo.modal.name')}
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Icon Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('pomo.modal.icon')}</Text>
                            <View style={styles.iconGrid}>
                                {PRESET_ICONS.map((emoji, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.iconButton,
                                            icon === emoji && styles.iconButtonSelected,
                                        ]}
                                        onPress={() => setIcon(emoji)}
                                    >
                                        <Text style={styles.iconText}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Mode Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('pomo.modal.mode')}</Text>

                            <TouchableOpacity
                                style={styles.modeRow}
                                onPress={() => setMode('pomodoro')}
                            >
                                <View style={styles.radioContainer}>
                                    <View style={[
                                        styles.radio,
                                        mode === 'pomodoro' && styles.radioSelected,
                                    ]}>
                                        {mode === 'pomodoro' && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                    <Text style={styles.modeText}>Pomo</Text>
                                </View>
                                <View style={styles.durationContainer}>
                                    <TextInput
                                        style={styles.durationInput}
                                        value={duration}
                                        onChangeText={setDuration}
                                        keyboardType="numeric"
                                        editable={mode === 'pomodoro'}
                                    />
                                    <Text style={styles.durationLabel}>{t('time.minutes')}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modeRow}
                                onPress={() => setMode('stopwatch')}
                            >
                                <View style={styles.radioContainer}>
                                    <View style={[
                                        styles.radio,
                                        mode === 'stopwatch' && styles.radioSelected,
                                    ]}>
                                        {mode === 'stopwatch' && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                    <Text style={styles.modeText}>{t('pomo.stopwatch')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            flex: 1,
            backgroundColor: colors.background,
            marginTop: 50,
            borderTopLeftRadius: borderRadius.xxl,
            borderTopRightRadius: borderRadius.xxl,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            flex: 1,
            textAlign: 'center',
        },
        body: {
            flex: 1,
            padding: spacing.lg,
        },
        inputContainer: {
            marginBottom: spacing.lg,
        },
        input: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            fontSize: 16,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: colors.border,
        },
        section: {
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textSecondary,
            marginBottom: spacing.md,
        },
        iconGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
        },
        iconButton: {
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.card,
        },
        iconButtonSelected: {
            backgroundColor: colors.primary + '40',
            borderWidth: 2,
            borderColor: colors.primary,
        },
        iconText: {
            fontSize: 20,
        },
        modeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: spacing.md,
        },
        radioContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
        },
        radio: {
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: colors.textMuted,
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioSelected: {
            borderColor: colors.primary,
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.primary,
        },
        modeText: {
            fontSize: 16,
            color: colors.textPrimary,
        },
        durationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        durationInput: {
            backgroundColor: colors.background,
            borderRadius: borderRadius.md,
            padding: spacing.sm,
            paddingHorizontal: spacing.md,
            fontSize: 16,
            color: colors.textPrimary,
            borderWidth: 1,
            borderColor: colors.border,
            minWidth: 60,
            textAlign: 'center',
        },
        durationLabel: {
            fontSize: 14,
            color: colors.textSecondary,
        },
    });
