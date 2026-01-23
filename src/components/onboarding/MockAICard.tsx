// components/onboarding/MockAICard.tsx
// Mock AI suggestion card for onboarding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, Zap, Clock, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../../constants/colors';

interface MockAICardProps {
    type?: 'energy' | 'time' | 'break';
}

export const MockAICard: React.FC<MockAICardProps> = ({ type = 'energy' }) => {
    const configs = {
        energy: {
            icon: <Zap size={20} color="#f59e0b" />,
            title: 'Yüksek Enerji Saati',
            message: 'Şu an enerjin yüksek! Zor görevler için ideal zaman.',
            gradient: ['#f59e0b', '#d97706'] as const,
        },
        time: {
            icon: <Clock size={20} color="#3b82f6" />,
            title: 'Akıllı Öneri',
            message: '"Toplantı hazırlığı" için en uygun zaman: 14:00',
            gradient: ['#3b82f6', '#2563eb'] as const,
        },
        break: {
            icon: <Brain size={20} color="#22c55e" />,
            title: 'Mola Zamanı',
            message: '2 saat kesintisiz çalıştın, kısa bir mola öneriyorum.',
            gradient: ['#22c55e', '#16a34a'] as const,
        },
    };

    const config = configs[type];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(124, 58, 237, 0.08)', 'transparent']}
                style={styles.gradient}
            />
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Sparkles size={14} color={colors.primary} style={styles.sparkle} />
                    {config.icon}
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>AI</Text>
                </View>
            </View>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.3)',
        overflow: 'hidden',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sparkle: {
        marginRight: 4,
    },
    badge: {
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.primary,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    message: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});
