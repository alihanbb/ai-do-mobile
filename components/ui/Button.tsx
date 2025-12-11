import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../../constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void | Promise<void>;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
    style,
}) => {
    const isDisabled = disabled || loading;

    const sizeStyles: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
        sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
        md: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
        lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 },
    };

    const currentSize = sizeStyles[size];

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                style={[fullWidth && styles.fullWidth, style]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.button,
                        {
                            paddingVertical: currentSize.paddingVertical,
                            paddingHorizontal: currentSize.paddingHorizontal,
                        },
                        isDisabled && styles.disabled,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textPrimary} size='small' />
                    ) : (
                        <>
                            {icon}
                            <Text style={[styles.text, { fontSize: currentSize.fontSize }]}>
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
        secondary: { bg: 'transparent', text: colors.primary, border: colors.primary },
        ghost: { bg: 'transparent', text: colors.textSecondary },
        danger: { bg: colors.error, text: colors.textPrimary },
    };

    const currentVariant = variantStyles[variant];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.button,
                {
                    backgroundColor: currentVariant.bg,
                    borderWidth: currentVariant.border ? 1 : 0,
                    borderColor: currentVariant.border,
                    paddingVertical: currentSize.paddingVertical,
                    paddingHorizontal: currentSize.paddingHorizontal,
                },
                isDisabled && styles.disabled,
                fullWidth && styles.fullWidth,
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={currentVariant.text} size='small' />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            { color: currentVariant.text, fontSize: currentSize.fontSize },
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        gap: spacing.sm,
    },
    text: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },
});
