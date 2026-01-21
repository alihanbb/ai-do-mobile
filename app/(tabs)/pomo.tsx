import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { useFocusTimer } from '../../src/features/focus/presentation/hooks/useFocusTimer';
import { useFocusStats } from '../../src/features/focus/presentation/hooks/useFocusStats';
import { DEFAULT_PRESETS, FocusPresetProps } from '../../src/features/focus/domain/entities/FocusPreset';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { TimerCircle } from '../../components/pomo/TimerCircle';
import { PresetModal } from '../../components/pomo/PresetModal';
import { StatsModal } from '../../components/pomo/StatsModal';
import { TaskSelectionModal } from '../../components/pomo/TaskSelectionModal';

export default function PomoScreen() {
    const { isDark } = useThemeStore();
    const { t } = useTranslation();
    const colors = getColors(isDark);

    const getPresetName = (preset: FocusPresetProps) => {
        if (preset.isDefault) {
            const keyMap: Record<string, string> = {
                'pomo-25': 'pomo.presets.pomo',
                'short-break': 'pomo.presets.shortBreak',
                'long-break': 'pomo.presets.longBreak',
                'study': 'pomo.presets.study',
                'exercise': 'pomo.presets.exercise',
            };
            if (keyMap[preset.id]) return t(keyMap[preset.id]);
        }
        return preset.name;
    };

    // Use the new focus hooks
    const {
        timerState,
        mode,
        remainingSeconds,
        elapsedSeconds,
        activePreset,
        linkedTaskId,
        linkedTaskTitle,
        start,
        pause,
        resume,
        reset,
        setPreset,
        setLinkedTask,
        setMode,
    } = useFocusTimer();

    const { stats, hourlyStats, timelineData } = useFocusStats();

    const [presetModalVisible, setPresetModalVisible] = useState(false);
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [taskSelectionVisible, setTaskSelectionVisible] = useState(false);
    const [presets] = useState<FocusPresetProps[]>(DEFAULT_PRESETS);

    const handleStartPause = () => {
        if (timerState === 'idle' || timerState === 'completed') {
            if (timerState === 'completed') {
                reset();
            }
            start();
        } else if (timerState === 'running') {
            pause();
        } else if (timerState === 'paused') {
            resume();
        }
    };

    const getButtonText = () => {
        switch (timerState) {
            case 'idle':
            case 'completed':
                return t('pomo.start');
            case 'running':
                return t('pomo.pause');
            case 'paused':
                return t('pomo.resume');
            default:
                return t('pomo.start');
        }
    };

    const handleSavePreset = (preset: FocusPresetProps) => {
        setPreset(preset);
    };

    const currentTime = mode === 'pomodoro' ? remainingSeconds : elapsedSeconds;
    const totalTime = activePreset?.durationMinutes ? activePreset.durationMinutes * 60 : 25 * 60;
    const isTimerActive = timerState === 'running' || timerState === 'paused';

    const styles = createStyles(colors);

    // Default stats if null
    const defaultStats = {
        totalSessions: 0,
        totalFocusMinutes: 0,
        todaySessions: 0,
        todayFocusMinutes: 0,
        todayPomoCount: 0,
        totalPomoCount: 0,
        averageSessionMinutes: 0,
        longestSessionMinutes: 0,
        currentStreak: 0,
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Mode Tabs */}
                <View style={styles.modeTabs}>
                    <TouchableOpacity
                        style={[styles.modeTab, mode === 'pomodoro' && styles.modeTabActive]}
                        onPress={() => !isTimerActive && setMode('pomodoro')}
                        disabled={isTimerActive}
                    >
                        <Text style={[styles.modeTabText, mode === 'pomodoro' && styles.modeTabTextActive]}>
                            Pomo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeTab, mode === 'stopwatch' && styles.modeTabActive]}
                        onPress={() => !isTimerActive && setMode('stopwatch')}
                        disabled={isTimerActive}
                    >
                        <Text style={[styles.modeTabText, mode === 'stopwatch' && styles.modeTabTextActive]}>
                            {t('pomo.stopwatch') || 'Kronometre'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setStatsModalVisible(true)}
                    >
                        <Clock size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Linked Task Display */}
            <View style={styles.linkedTaskContainer}>
                <TouchableOpacity
                    style={styles.linkedTaskButton}
                    onPress={() => setTaskSelectionVisible(true)}
                >
                    <Text style={styles.linkedTaskText}>
                        {linkedTaskTitle || t('pomo.focus')}
                    </Text>
                    {/* Arrow removed */}
                </TouchableOpacity>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
                <TimerCircle
                    timeInSeconds={currentTime}
                    totalTimeInSeconds={totalTime}
                    mode={mode === 'pomodoro' ? 'pomo' : 'stopwatch'}
                    isRunning={timerState === 'running'}
                />
            </View>

            {/* Preset Selection */}
            <View style={styles.presetRow}>
                {presets.slice(0, 4).map((preset) => (
                    <TouchableOpacity
                        key={preset.id}
                        style={[
                            styles.presetChip,
                            activePreset?.id === preset.id && styles.presetChipActive,
                        ]}
                        onPress={() => !isTimerActive && setPreset(preset)}
                        disabled={isTimerActive}
                    >
                        <Text style={styles.presetIcon}>{preset.icon}</Text>
                        <Text style={[
                            styles.presetText,
                            activePreset?.id === preset.id && styles.presetTextActive,
                        ]}>

                            {getPresetName(preset)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Control Buttons */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={[
                        styles.mainButton,
                        timerState === 'running' && styles.pauseButton,
                    ]}
                    onPress={handleStartPause}
                >
                    <Text style={styles.mainButtonText}>{getButtonText()}</Text>
                </TouchableOpacity>

                {isTimerActive && (
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={reset}
                    >
                        <Text style={styles.resetButtonText}>{t('pomo.reset')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Preset Modal */}
            <PresetModal
                visible={presetModalVisible}
                onClose={() => setPresetModalVisible(false)}
                onSave={handleSavePreset}
            />

            {/* Stats Modal */}
            <StatsModal
                visible={statsModalVisible}
                onClose={() => setStatsModalVisible(false)}
                stats={stats || defaultStats}
                hourlyData={hourlyStats}
                timelineData={timelineData}
            />

            {/* Task Selection Modal */}
            <TaskSelectionModal
                visible={taskSelectionVisible}
                onClose={() => setTaskSelectionVisible(false)}
                onSelectTask={(taskId, taskTitle) => setLinkedTask(taskId, taskTitle)}
                selectedTaskId={linkedTaskId || undefined}
            />
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
        },
        modeTabs: {
            flexDirection: 'row',
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.full,
            padding: spacing.xs,
        },
        modeTab: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
        },
        modeTabActive: {
            backgroundColor: colors.primary,
        },
        modeTabText: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500',
        },
        modeTabTextActive: {
            color: '#FFFFFF',
            fontWeight: '600',
        },
        headerActions: {
            flexDirection: 'row',
            gap: spacing.sm,
        },
        headerButton: {
            padding: spacing.sm,
        },
        linkedTaskContainer: {
            alignItems: 'center',
            paddingVertical: spacing.md,
        },
        linkedTaskButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        linkedTaskText: {
            color: colors.textPrimary,
            fontSize: 16,
        },
        linkedTaskArrow: {
            color: colors.textMuted,
            fontSize: 16,
        },
        timerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        presetRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
        },
        presetChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            backgroundColor: colors.surfaceSolid,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
        },
        presetChipActive: {
            backgroundColor: colors.primary,
        },
        presetIcon: {
            fontSize: 14,
        },
        presetText: {
            color: colors.textSecondary,
            fontSize: 12,
        },
        presetTextActive: {
            color: '#FFFFFF',
            fontWeight: '500',
        },
        controls: {
            alignItems: 'center',
            paddingBottom: spacing.xxxl,
            gap: spacing.md,
        },
        mainButton: {
            backgroundColor: colors.primary,
            paddingHorizontal: spacing.xxxl * 2,
            paddingVertical: spacing.lg,
            borderRadius: borderRadius.full,
        },
        pauseButton: {
            backgroundColor: colors.accent,
        },
        mainButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '600',
        },
        resetButton: {
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.sm,
        },
        resetButtonText: {
            color: colors.textMuted,
            fontSize: 14,
        },
    });
