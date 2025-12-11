import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { getColors, spacing } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';

interface TimerCircleProps {
    timeInSeconds: number;
    totalTimeInSeconds?: number;
    mode: 'pomo' | 'stopwatch';
    isRunning?: boolean;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({
    timeInSeconds,
    totalTimeInSeconds = 25 * 60,
    mode,
    isRunning = false,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    // Calculate progress
    const progress = mode === 'pomo'
        ? timeInSeconds / totalTimeInSeconds
        : 0;

    // Circle dimensions
    const size = 280;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    // Format time
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Generate tick marks
    const tickCount = 60;
    const ticks = Array.from({ length: tickCount }, (_, i) => {
        const angle = (i * 360) / tickCount - 90;
        const isLarge = i % 5 === 0;
        return { angle, isLarge };
    });

    const styles = createStyles(colors, size);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Tick marks */}
                <G>
                    {ticks.map((tick, index) => {
                        const innerRadius = radius - (tick.isLarge ? 20 : 15);
                        const outerRadius = radius - 8;
                        const angleRad = (tick.angle * Math.PI) / 180;

                        const x1 = size / 2 + innerRadius * Math.cos(angleRad);
                        const y1 = size / 2 + innerRadius * Math.sin(angleRad);
                        const x2 = size / 2 + outerRadius * Math.cos(angleRad);
                        const y2 = size / 2 + outerRadius * Math.sin(angleRad);

                        return (
                            <Circle
                                key={index}
                                cx={x2}
                                cy={y2}
                                r={tick.isLarge ? 2 : 1}
                                fill={colors.textMuted}
                                opacity={0.5}
                            />
                        );
                    })}
                </G>

                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={colors.border}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Progress circle (only for pomo mode) */}
                {mode === 'pomo' && (
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colors.primary}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                )}
            </Svg>

            {/* Time display */}
            <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(timeInSeconds)}</Text>
            </View>
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>, size: number) =>
    StyleSheet.create({
        container: {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeContainer: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeText: {
            fontSize: 64,
            fontWeight: '300',
            color: colors.textPrimary,
            fontVariant: ['tabular-nums'],
        },
    });
