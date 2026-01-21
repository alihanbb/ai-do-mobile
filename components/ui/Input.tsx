import React from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { colors, borderRadius, spacing } from '../../constants/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={containerStyle}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputError,
                    props.editable === false && styles.inputDisabled,
                ]}
            >
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInput
                    style={[styles.input, icon ? styles.inputWithIcon : undefined]}
                    placeholderTextColor={colors.textMuted}
                    autoCorrect={false}
                    autoComplete='off'
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: spacing.sm,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceSolid,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.lg,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
        paddingVertical: spacing.md + 2,
    },
    inputWithIcon: {
        marginLeft: spacing.sm,
    },
    icon: {
        marginRight: spacing.xs,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputDisabled: {
        opacity: 0.5,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: spacing.xs,
    },
});
