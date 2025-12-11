import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { TaskCategory, TaskPriority, categoryColors, priorityColors } from '../../types/task';
import { Search, Filter, X, Check } from 'lucide-react-native';
import { Button } from '../ui/Button';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress: () => void;
    activeFilters: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onFilterPress,
    activeFilters,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={18} color={colors.textMuted} />
                <TextInput
                    style={styles.input}
                    placeholder="Görev ara..."
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText('')}>
                        <X size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <Filter size={20} color={colors.textSecondary} />
                {activeFilters > 0 && (
                    <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>{activeFilters}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    selectedCategories: TaskCategory[];
    selectedPriorities: TaskPriority[];
    onCategoryToggle: (category: TaskCategory) => void;
    onPriorityToggle: (priority: TaskPriority) => void;
    onClearFilters: () => void;
}

const categoryLabels: Record<TaskCategory, string> = {
    work: 'İş',
    personal: 'Kişisel',
    health: 'Sağlık',
    education: 'Eğitim',
    shopping: 'Alışveriş',
    finance: 'Finans',
    social: 'Sosyal',
    other: 'Diğer',
};

const priorityLabels: Record<TaskPriority, string> = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    urgent: 'Acil',
};

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    selectedCategories,
    selectedPriorities,
    onCategoryToggle,
    onPriorityToggle,
    onClearFilters,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Filtrele</Text>
                    <TouchableOpacity onPress={onClearFilters}>
                        <Text style={styles.clearText}>Temizle</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    {/* Categories */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Kategoriler</Text>
                        <View style={styles.optionGrid}>
                            {(Object.keys(categoryLabels) as TaskCategory[]).map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.optionItem,
                                        selectedCategories.includes(cat) && styles.optionItemSelected,
                                        selectedCategories.includes(cat) && { borderColor: categoryColors[cat] },
                                    ]}
                                    onPress={() => onCategoryToggle(cat)}
                                >
                                    <View style={[styles.colorDot, { backgroundColor: categoryColors[cat] }]} />
                                    <Text style={[
                                        styles.optionLabel,
                                        selectedCategories.includes(cat) && { color: categoryColors[cat] },
                                    ]}>
                                        {categoryLabels[cat]}
                                    </Text>
                                    {selectedCategories.includes(cat) && (
                                        <Check size={16} color={categoryColors[cat]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Priorities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Öncelik</Text>
                        <View style={styles.optionGrid}>
                            {(Object.keys(priorityLabels) as TaskPriority[]).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.optionItem,
                                        selectedPriorities.includes(p) && styles.optionItemSelected,
                                        selectedPriorities.includes(p) && { borderColor: priorityColors[p] },
                                    ]}
                                    onPress={() => onPriorityToggle(p)}
                                >
                                    <View style={[styles.colorDot, { backgroundColor: priorityColors[p] }]} />
                                    <Text style={[
                                        styles.optionLabel,
                                        selectedPriorities.includes(p) && { color: priorityColors[p] },
                                    ]}>
                                        {priorityLabels[p]}
                                    </Text>
                                    {selectedPriorities.includes(p) && (
                                        <Check size={16} color={priorityColors[p]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Apply Button */}
                <View style={styles.modalFooter}>
                    <Button
                        title="Uygula"
                        onPress={onClose}
                        fullWidth
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
        paddingVertical: spacing.md,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: colors.primary,
        borderRadius: 10,
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        color: colors.textPrimary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '600',
    },
    clearText: {
        color: colors.primary,
        fontSize: 16,
    },
    modalContent: {
        flex: 1,
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.md,
        textTransform: 'uppercase',
    },
    optionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surfaceSolid,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    optionItemSelected: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 2,
    },
    optionLabel: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    modalFooter: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});
