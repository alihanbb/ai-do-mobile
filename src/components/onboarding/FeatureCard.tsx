// components/onboarding/FeatureCard.tsx
// Glassmorphism style feature card for onboarding pages

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '../../constants/colors';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient?: readonly [string, string];
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    gradient = [colors.primary, colors.primaryDark],
}) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(124, 58, 237, 0.1)', 'rgba(124, 58, 237, 0.02)']}
                style={styles.gradient}
            />
            <View style={styles.iconContainer}>
                <LinearGradient colors={gradient} style={styles.iconBackground}>
                    {icon}
                </LinearGradient>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    iconContainer: {
        marginBottom: spacing.md,
    },
    iconBackground: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});
