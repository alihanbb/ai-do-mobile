import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { ArrowLeft, Clock, Sun, Moon } from 'lucide-react-native';
import { userApi } from '../../src/features/auth/infrastructure/api/userApi';
import { WorkingHoursDto } from '../../src/features/auth/infrastructure/api/userApiTypes';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function WorkingHoursScreen() {
    const { t } = useTranslation();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const router = useRouter();
    const styles = createStyles(colors, isDark);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());

    // Picker state
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const parseTime = (timeStr: string | null): Date => {
        const date = new Date();
        if (!timeStr) {
            date.setHours(9, 0, 0, 0); // Default 09:00
            return date;
        }
        const [hours, minutes] = timeStr.split(':').map(Number);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const loadPreferences = async () => {
        try {
            const result = await userApi.getPreferences();
            if (result.success && result.data) {
                setStartTime(parseTime(result.data.workingHoursStart));
                setEndTime(parseTime(result.data.workingHoursEnd || '17:00'));
            }
        } catch (error) {
            console.error('Failed to load preferences:', error);
            Alert.alert(t('common.error'), t('common.loadError') || 'Ayarlar yüklenirken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const startStr = formatTime(startTime);
            const endStr = formatTime(endTime);

            const result = await userApi.updateWorkingHours({
                start: startStr,
                end: endStr
            });

            if (result.success) {
                Alert.alert(t('common.success'), t('workingHours.updateSuccess'));
                router.back();
            } else {
                throw new Error(result.error?.message);
            }
        } catch (error) {
            console.error('Failed to save working hours:', error);
            Alert.alert(t('common.error'), t('workingHours.updateError'));
        } finally {
            setIsSaving(false);
        }
    };

    const onStartChange = (event: any, selectedDate?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartTime(selectedDate);
            if (Platform.OS === 'android') setShowStartPicker(false);
        } else {
            if (Platform.OS === 'android') setShowStartPicker(false);
        }
    };

    const onEndChange = (event: any, selectedDate?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndTime(selectedDate);
            if (Platform.OS === 'android') setShowEndPicker(false);
        } else {
            if (Platform.OS === 'android') setShowEndPicker(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('workingHours.title')}</Text>
                <View style={{ width: 40 }} />
            </View>
        </View>
    );

    const renderVisualizer = () => {
        const startHour = startTime.getHours() + startTime.getMinutes() / 60;
        const endHour = endTime.getHours() + endTime.getMinutes() / 60;

        // Calculate percentages
        const totalHours = 24;
        const startPercent = (startHour / totalHours) * 100;
        const widthPercent = ((endHour - startHour) / totalHours) * 100;

        return (
            <View style={styles.visualizerContainer}>
                <View style={styles.visualizerBar}>
                    {/* Night (Pre-work) */}
                    <View style={[styles.visualSegment, { width: `${startPercent}%`, backgroundColor: colors.surface }]} />

                    {/* Work */}
                    <View style={[styles.visualSegment, { width: `${Math.max(0, widthPercent)}%`, backgroundColor: colors.primary }]}>
                        <View style={styles.workLabelContainer}>
                            <Text style={styles.workLabel}>{t('categories.work') || 'Work'}</Text>
                        </View>
                    </View>

                    {/* Night (Post-work) */}
                    <View style={[styles.visualSegment, { flex: 1, backgroundColor: colors.surface }]} />
                </View>
                <View style={styles.timeLabels}>
                    <Text style={[styles.timeLabel, { left: 0 }]}>00:00</Text>
                    <Text style={[styles.timeLabel, { left: '50%', transform: [{ translateX: -15 }] }]}>12:00</Text>
                    <Text style={[styles.timeLabel, { right: 0 }]}>23:59</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            {renderHeader()}

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.description}>
                    {t('workingHours.description')}
                </Text>

                {renderVisualizer()}

                <View style={styles.inputsContainer}>
                    {/* Start Time Input */}
                    <TouchableOpacity
                        style={styles.timeCard}
                        onPress={() => setShowStartPicker(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.timeCardHeader}>
                            <Sun size={20} color={colors.warning} />
                            <Text style={styles.timeCardLabel}>{t('workingHours.startTime')}</Text>
                        </View>
                        <Text style={styles.timeValue}>
                            {formatTime(startTime)}
                        </Text>
                        {showStartPicker && (
                            <DateTimePicker
                                testID="startTimePicker"
                                value={startTime}
                                mode="time"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onStartChange}
                                themeVariant={isDark ? "dark" : "light"}
                            />
                        )}
                    </TouchableOpacity>

                    {/* End Time Input */}
                    <TouchableOpacity
                        style={styles.timeCard}
                        onPress={() => setShowEndPicker(true)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.timeCardHeader}>
                            <Moon size={20} color={colors.secondary} />
                            <Text style={styles.timeCardLabel}>{t('workingHours.endTime')}</Text>
                        </View>
                        <Text style={styles.timeValue}>
                            {formatTime(endTime)}
                        </Text>
                        {showEndPicker && (
                            <DateTimePicker
                                testID="endTimePicker"
                                value={endTime}
                                mode="time"
                                is24Hour={true}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onEndChange}
                                themeVariant={isDark ? "dark" : "light"}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={t('common.save')}
                    onPress={handleSave}
                    loading={isSaving}
                    fullWidth
                    variant="primary"
                />
            </View>

        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.md,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.lg,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    visualizerContainer: {
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    visualizerBar: {
        height: 40,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xs,
    },
    visualSegment: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    workLabelContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    workLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        height: 20,
    },
    timeLabel: {
        position: 'absolute',
        fontSize: 10,
        color: colors.textMuted,
    },
    inputsContainer: {
        gap: spacing.lg,
    },
    timeCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        gap: spacing.md,
    },
    timeCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    timeCardLabel: {
        fontSize: 16,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    timeValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
        letterSpacing: 2,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
    }
});
