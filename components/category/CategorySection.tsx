import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useCategoryStore } from '../../store/categoryStore';
import { AddCategoryModal } from './AddCategoryModal';
import {
    Plus,
    Briefcase,
    User,
    Heart,
    BookOpen,
    ShoppingCart,
    Wallet,
    Users,
    Folder,
    Home,
    Star,
    Music,
    Camera,
    Coffee,
    Gift,
    Globe,
    Flag,
    Zap,
    Target,
    Trophy,
    Gamepad2,
    Plane,
    Car,
    Utensils,
    Dumbbell,
    Palette,
    Code,
    Lightbulb,
    ChevronRight,
} from 'lucide-react-native';

const iconComponents: Record<string, any> = {
    'briefcase': Briefcase,
    'user': User,
    'heart': Heart,
    'book-open': BookOpen,
    'shopping-cart': ShoppingCart,
    'wallet': Wallet,
    'users': Users,
    'folder': Folder,
    'home': Home,
    'star': Star,
    'music': Music,
    'camera': Camera,
    'coffee': Coffee,
    'gift': Gift,
    'globe': Globe,
    'flag': Flag,
    'zap': Zap,
    'target': Target,
    'trophy': Trophy,
    'gamepad-2': Gamepad2,
    'plane': Plane,
    'car': Car,
    'utensils': Utensils,
    'dumbbell': Dumbbell,
    'palette': Palette,
    'code': Code,
    'lightbulb': Lightbulb,
};

interface CategorySectionProps {
    onCategorySelect?: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onCategorySelect }) => {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { categories } = useCategoryStore();
    const [showAddModal, setShowAddModal] = useState(false);

    const styles = createStyles(colors);

    const renderIcon = (iconName: string, color: string) => {
        const IconComponent = iconComponents[iconName];
        if (!IconComponent) return <Folder size={24} color={color} />;
        return <IconComponent size={24} color={color} />;
    };

    const handleCategoryPress = (categoryId: string) => {
        if (onCategorySelect) {
            onCategorySelect(categoryId);
        } else {
            // Navigate to task creation with pre-selected category
            router.push(`/task/create?category=${categoryId}`);
        }
    };

    // Varsayılan ve özel kategorileri ayır
    const defaultCategories = categories.filter(c => c.isDefault);
    const customCategories = categories.filter(c => !c.isDefault);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kategoriler</Text>
                <TouchableOpacity
                    onPress={() => setShowAddModal(true)}
                    style={styles.addButton}
                >
                    <Plus size={20} color={colors.primary} />
                    <Text style={styles.addButtonText}>Ekle</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Özel kategoriler önce */}
                {customCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => handleCategoryPress(category.id)}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[category.color + '20', category.color + '10']}
                            style={styles.cardGradient}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: category.color + '30' }]}>
                                {renderIcon(category.icon, category.color)}
                            </View>
                            <Text style={styles.categoryName} numberOfLines={1}>
                                {category.name}
                            </Text>
                            <View style={styles.taskCountContainer}>
                                <Text style={[styles.taskCount, { color: category.color }]}>
                                    {category.taskCount}
                                </Text>
                                <Text style={styles.taskLabel}>görev</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: category.color }]}>
                                <Text style={styles.badgeText}>Özel</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}

                {/* Varsayılan kategoriler */}
                {defaultCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => handleCategoryPress(category.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardContent}>
                            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                                {renderIcon(category.icon, category.color)}
                            </View>
                            <Text style={styles.categoryName} numberOfLines={1}>
                                {category.name}
                            </Text>
                            <View style={styles.taskCountContainer}>
                                <Text style={[styles.taskCount, { color: category.color }]}>
                                    {category.taskCount}
                                </Text>
                                <Text style={styles.taskLabel}>görev</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Kategori ekleme butonu */}
                <TouchableOpacity
                    style={styles.addCategoryCard}
                    onPress={() => setShowAddModal(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.addCardContent}>
                        <View style={styles.addIconContainer}>
                            <Plus size={28} color={colors.primary} />
                        </View>
                        <Text style={styles.addCategoryText}>Yeni{'\n'}Kategori</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            <AddCategoryModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
            />
        </View>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            marginBottom: spacing.xxl,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
        },
        addButtonText: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '600',
        },
        scrollContent: {
            paddingRight: spacing.lg,
            gap: spacing.md,
        },
        categoryCard: {
            width: 120,
            height: 140,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        cardGradient: {
            flex: 1,
            padding: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardContent: {
            flex: 1,
            padding: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
        },
        categoryName: {
            color: colors.textPrimary,
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: spacing.xs,
        },
        taskCountContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 4,
        },
        taskCount: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        taskLabel: {
            color: colors.textMuted,
            fontSize: 12,
        },
        badge: {
            position: 'absolute',
            top: spacing.xs,
            right: spacing.xs,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
            borderRadius: borderRadius.sm,
        },
        badgeText: {
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '600',
        },
        addCategoryCard: {
            width: 100,
            height: 140,
            borderRadius: borderRadius.lg,
            backgroundColor: colors.surfaceSolid,
            borderWidth: 2,
            borderColor: colors.primary,
            borderStyle: 'dashed',
        },
        addCardContent: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.md,
        },
        addIconContainer: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.full,
            backgroundColor: colors.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.sm,
        },
        addCategoryText: {
            color: colors.primary,
            fontSize: 12,
            fontWeight: '600',
            textAlign: 'center',
        },
    });

export default CategorySection;
