import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { FocusMode } from '../../src/features/focus/domain/entities/FocusSession';

interface TimerTabsProps {
    activeMode: FocusMode;
    onModeChange: (mode: FocusMode) => void;
    disabled?: boolean;
}

export const TimerTabs: React.FC<TimerTabsProps> = ({
    activeMode,
    onModeChange,
    disabled = false,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeMode === 'pomodoro' && styles.tabActive,
                ]}
                onPress={() => onModeChange('pomodoro')}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeMode === 'pomodoro' && styles.tabTextActive,
                    ]}
                >
                    Pomo
                </Text>
                {activeMode === 'pomodoro' && <View style={styles.indicator} />}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.tab,
                    activeMode === 'stopwatch' && styles.tabActive,
                ]}
                onPress={() => onModeChange('stopwatch')}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.tabText,
                        activeMode === 'stopwatch' && styles.tabTextActive,
                    ]}
                >
                    Kronometre
                </Text>
                {activeMode === 'stopwatch' && <View style={styles.indicator} />}
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: spacing.lg,
        },
        tab: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.xs,
            position: 'relative',
        },
        tabActive: {},
        tabText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.textMuted,
        },
        tabTextActive: {
            color: colors.textPrimary,
            fontWeight: '600',
        },
        indicator: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: colors.primary,
            borderRadius: 1,
        },
    });
