import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AISuggestion } from '../../types/task';
import { colors, borderRadius, spacing } from '../../constants/colors';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, X, Zap, Clock, Bell } from 'lucide-react-native';

interface AISuggestionCardProps {
    suggestion: AISuggestion;
    onAccept?: () => void;
    onDismiss: () => void;
}

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
    suggestion,
    onAccept,
    onDismiss,
}) => {
    const getIcon = () => {
        switch (suggestion.type) {
            case 'energy':
                return <Zap size={20} color={colors.warning} />;
            case 'break':
                return <Clock size={20} color={colors.secondary} />;
            case 'reminder':
                return <Bell size={20} color={colors.accent} />;
            default:
                return <Sparkles size={20} color={colors.primary} />;
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(124, 58, 237, 0.15)', 'rgba(8, 145, 178, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>
                    <View style={styles.titleContainer}>
                        <View style={styles.badge}>
                            <Sparkles size={10} color={colors.primary} />
                            <Text style={styles.badgeText}>AI Onerisi</Text>
                        </View>
                        <Text style={styles.title}>{suggestion.title}</Text>
                    </View>
                    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                        <X size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.message}>{suggestion.message}</Text>

                <View style={styles.actions}>
                    {onAccept && (
                        <Button
                            title='Simdi Basla'
                            onPress={onAccept}
                            variant='primary'
                            size='sm'
                        />
                    )}
                    <Button
                        title='Sonra'
                        onPress={onDismiss}
                        variant='ghost'
                        size='sm'
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    gradient: {
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    titleContainer: {
        flex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: spacing.xs,
    },
    message: {
        color: colors.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.lg,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
});
