import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';

interface PeakHoursProps {
    peakTime: string;
    data: number[]; // 24 hours data (0-23)
}

export const PeakHours = React.memo(function PeakHours({ peakTime, data }: PeakHoursProps) {
    const { isDark } = useThemeStore();
    const { i18n } = useTranslation();
    const colors = getColors(isDark);

    const maxValue = Math.max(...data, 1);
    const normalizedData = data.map(v => v / maxValue);

    return (
        <View style={[styles.container, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {i18n.language === 'en' ? 'Peak Hours' : 'Yoğun saatler'}
                </Text>
                <Text style={[styles.peakTime, { color: colors.primary }]}>{peakTime}</Text>
            </View>

            <View style={styles.chart}>
                {/* Time markers */}
                <View style={styles.timeMarkers}>
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>00:00</Text>
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>12:00</Text>
                    <Text style={[styles.timeText, { color: colors.textMuted }]}>24:00</Text>
                </View>

                {/* Bars */}
                <View style={styles.barsContainer}>
                    {normalizedData.map((value, index) => {
                        const isPeak = data[index] === Math.max(...data) && data[index] > 0;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max(value * 50, 2),
                                        backgroundColor: isPeak ? colors.error : colors.primary,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Dashed line */}
                <View style={[styles.dashedLine, { borderColor: colors.textMuted }]} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    peakTime: {
        fontSize: 16,
        fontWeight: '600',
    },
    chart: {
        height: 80,
    },
    timeMarkers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    timeText: {
        fontSize: 10,
    },
    barsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
    },
    bar: {
        flex: 1,
        borderRadius: 2,
    },
    dashedLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 40,
        borderTopWidth: 1,
        borderStyle: 'dashed',
    },
});
