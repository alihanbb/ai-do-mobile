import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { Clock, Plus, MoreVertical } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import { usePomoStore } from '../../store/pomoStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { TimerCircle } from '../../components/pomo/TimerCircle';
import { TimerTabs } from '../../components/pomo/TimerTabs';
import { PresetModal } from '../../components/pomo/PresetModal';
import { FocusModeSelector } from '../../components/pomo/FocusModeSelector';
import { StatsModal } from '../../components/pomo/StatsModal';
import { TimerPreset } from '../../types/pomo';

export default function PomoScreen() {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const {
        mode,
        timerState,
        remainingTime,
        elapsedTime,
        activePreset,
        setMode,
        setActivePreset,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        tick,
        completeSession,
        addPreset,
        getStats,
    } = usePomoStore();

    const [presetModalVisible, setPresetModalVisible] = useState(false);
    const [statsModalVisible, setStatsModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer tick effect
    useEffect(() => {
        if (timerState === 'running') {
            timerRef.current = setInterval(() => {
                tick();
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerState, tick]);

    // Handle timer completion
    useEffect(() => {
        if (timerState === 'completed') {
            // Could show notification or play sound here
        }
    }, [timerState]);

    const handleStartPause = () => {
        if (timerState === 'idle' || timerState === 'completed') {
            if (timerState === 'completed') {
                resetTimer();
            }
            startTimer();
        } else if (timerState === 'running') {
            pauseTimer();
        } else if (timerState === 'paused') {
            resumeTimer();
        }
    };

    const getButtonText = () => {
        switch (timerState) {
            case 'idle':
            case 'completed':
                return 'Başlat';
            case 'running':
                return 'Duraklat';
            case 'paused':
                return 'Devam Et';
            default:
                return 'Başlat';
        }
    };

    const handleSavePreset = (preset: TimerPreset) => {
        addPreset(preset);
        setActivePreset(preset);
    };

    const currentTime = mode === 'pomo' ? remainingTime : elapsedTime;
    const totalTime = activePreset?.duration ? activePreset.duration * 60 : 25 * 60;
    const isTimerActive = timerState === 'running' || timerState === 'paused';

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TimerTabs
                    activeMode={mode}
                    onModeChange={setMode}
                    disabled={isTimerActive}
                />
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setStatsModalVisible(true)}
                    >
                        <Clock size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setPresetModalVisible(true)}
                    >
                        <Plus size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setMenuVisible(!menuVisible)}
                    >
                        <MoreVertical size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Focus Mode Selector */}
            <View style={styles.focusSelector}>
                <FocusModeSelector
                    onSettingsPress={() => { }}
                    onAddRecordPress={() => setPresetModalVisible(true)}
                />
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
                <TimerCircle
                    timeInSeconds={currentTime}
                    totalTimeInSeconds={totalTime}
                    mode={mode}
                    isRunning={timerState === 'running'}
                />
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
                        onPress={resetTimer}
                    >
                        <Text style={styles.resetButtonText}>Sıfırla</Text>
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
                stats={getStats()}
            />
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
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: Platform.OS === 'android' ? spacing.lg + (StatusBar.currentHeight || 24) : spacing.lg,
            paddingBottom: spacing.md,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
        },
        headerButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        focusSelector: {
            alignItems: 'center',
            paddingVertical: spacing.md,
        },
        timerContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
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
            backgroundColor: colors.warning,
        },
        mainButtonText: {
            color: colors.textPrimary,
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
