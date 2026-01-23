// components/onboarding/MockTimerPreview.tsx
// Mock Pomodoro timer preview for onboarding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Play, Coffee, Book } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../../constants/colors';

export const MockTimerPreview: React.FC = () => {
    const size = 160;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference * (1 - 0.7); // 70% progress

    return (
        <View style={styles.container}>
            {/* Timer Circle */}
            <View style={styles.timerContainer}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(124, 58, 237, 0.2)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colors.primary}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
                <View style={styles.timerContent}>
                    <Text style={styles.timerText}>17:30</Text>
                    <Text style={styles.timerLabel}>Çalışma</Text>
                </View>
            </View>

            {/* Preset Icons */}
            <View style={styles.presetsRow}>
                <View style={[styles.preset, styles.presetActive]}>
                    <Text style={styles.presetIcon}>🍅</Text>
                    <Text style={styles.presetLabel}>Pomo</Text>
                </View>
                <View style={styles.preset}>
                    <Text style={styles.presetIcon}>☕</Text>
                    <Text style={styles.presetLabel}>Mola</Text>
                </View>
                <View style={styles.preset}>
                    <Text style={styles.presetIcon}>📚</Text>
                    <Text style={styles.presetLabel}>Çalışma</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.xl,
    },
    timerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    timerLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    presetsRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    preset: {
        alignItems: 'center',
        backgroundColor: colors.surfaceSolid,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        minWidth: 70,
    },
    presetActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
    },
    presetIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    presetLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
