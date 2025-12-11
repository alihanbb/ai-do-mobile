import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';

type TabOption = 'day' | 'week' | 'trend';

interface AnalyticsTabsProps {
    activeTab: TabOption;
    onTabChange: (tab: TabOption) => void;
}

export const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);

    const tabs: { key: TabOption; label: string }[] = [
        { key: 'day', label: 'Gün' },
        { key: 'week', label: 'Hafta' },
        { key: 'trend', label: 'Trend' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.surfaceSolid }]}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    style={[
                        styles.tab,
                        activeTab === tab.key && {
                            backgroundColor: colors.primary,
                        },
                    ]}
                    onPress={() => onTabChange(tab.key)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            { color: activeTab === tab.key ? colors.textPrimary : colors.textMuted },
                        ]}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: borderRadius.full,
        padding: 4,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
