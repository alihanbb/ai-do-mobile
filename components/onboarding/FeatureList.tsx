// components/onboarding/FeatureList.tsx
// Feature list with checkmarks for onboarding

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { colors, spacing } from '../../constants/colors';

interface FeatureListProps {
    features: string[];
    color?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({
    features,
    color = colors.success,
}) => {
    return (
        <View style={styles.container}>
            {features.map((feature, index) => (
                <View key={index} style={styles.item}>
                    <CheckCircle2 size={18} color={color} />
                    <Text style={styles.text}>{feature}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    text: {
        fontSize: 14,
        color: colors.textPrimary,
    },
});
