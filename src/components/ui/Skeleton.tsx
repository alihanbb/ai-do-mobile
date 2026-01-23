import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useEffect } from 'react';

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: object;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius: radius = borderRadius.md,
    style,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: isDark ? colors.border : '#e5e7eb',
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

export const TaskCardSkeleton: React.FC = () => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    return (
        <View style={[styles.taskCard, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
            <View style={styles.taskContent}>
                <Skeleton width={24} height={24} borderRadius={borderRadius.sm} />
                <View style={styles.taskInfo}>
                    <Skeleton width="70%" height={16} />
                    <View style={styles.taskMeta}>
                        <Skeleton width={60} height={12} />
                        <Skeleton width={40} height={12} />
                    </View>
                </View>
                <Skeleton width={4} height={40} borderRadius={2} />
            </View>
        </View>
    );
};

export const StatCardSkeleton: React.FC = () => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    return (
        <View style={[styles.statCard, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]}>
            <Skeleton width={48} height={48} borderRadius={borderRadius.md} />
            <Skeleton width={40} height={24} style={{ marginTop: spacing.sm }} />
            <Skeleton width={60} height={12} style={{ marginTop: spacing.xs }} />
        </View>
    );
};

const styles = StyleSheet.create({
    taskCard: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    taskInfo: {
        flex: 1,
        gap: spacing.xs,
    },
    taskMeta: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statCard: {
        width: '47%',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        padding: spacing.md,
        alignItems: 'center',
    },
});
