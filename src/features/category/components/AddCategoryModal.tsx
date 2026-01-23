import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useCategoryStore } from '../../store/categoryStore';
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from '../../src/features/category/domain/entities/Category';
import {
    X,
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
    Check,
} from 'lucide-react-native';

interface AddCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

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

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { addCategory } = useCategoryStore();

    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('folder');
    const [selectedColor, setSelectedColor] = useState('#8b5cf6');
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (!name.trim()) {
            setError('Kategori adı gerekli');
            return;
        }

        addCategory({
            name: name.trim(),
            icon: selectedIcon,
            color: selectedColor,
        });

        // Reset form
        setName('');
        setSelectedIcon('folder');
        setSelectedColor('#8b5cf6');
        setError('');

        onSuccess?.();
        onClose();
    };

    const handleClose = () => {
        setName('');
        setSelectedIcon('folder');
        setSelectedColor('#8b5cf6');
        setError('');
        onClose();
    };

    const styles = createStyles(colors);

    const renderIcon = (iconName: string, size: number = 24, color: string = colors.textSecondary) => {
        const IconComponent = iconComponents[iconName];
        if (!IconComponent) return null;
        return <IconComponent size={size} color={color} />;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Yeni Kategori</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <X size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Preview */}
                        <View style={styles.previewContainer}>
                            <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
                                {renderIcon(selectedIcon, 32, selectedColor)}
                            </View>
                            <Text style={styles.previewName}>
                                {name || 'Kategori Adı'}
                            </Text>
                        </View>

                        {/* Name Input */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Kategori Adı</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Örn: Spor, Hobi, Proje..."
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setError('');
                                }}
                            />
                            {error && <Text style={styles.errorText}>{error}</Text>}
                        </View>

                        {/* Icon Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>İkon Seç</Text>
                            <View style={styles.iconGrid}>
                                {AVAILABLE_ICONS.map((icon) => (
                                    <TouchableOpacity
                                        key={icon}
                                        onPress={() => setSelectedIcon(icon)}
                                        style={[
                                            styles.iconItem,
                                            selectedIcon === icon && {
                                                backgroundColor: selectedColor + '20',
                                                borderColor: selectedColor,
                                            },
                                        ]}
                                    >
                                        {renderIcon(icon, 22, selectedIcon === icon ? selectedColor : colors.textSecondary)}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Color Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Renk Seç</Text>
                            <View style={styles.colorGrid}>
                                {AVAILABLE_COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => setSelectedColor(color)}
                                        style={[
                                            styles.colorItem,
                                            { backgroundColor: color },
                                            selectedColor === color && styles.colorItemSelected,
                                        ]}
                                    >
                                        {selectedColor === color && (
                                            <Check size={16} color="#ffffff" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Create Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
                            <LinearGradient
                                colors={[selectedColor, selectedColor + 'cc']}
                                style={styles.gradient}
                            >
                                <Text style={styles.createButtonText}>Kategori Oluştur</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'flex-end',
        },
        container: {
            backgroundColor: colors.background,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            maxHeight: '90%',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        closeButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            padding: spacing.lg,
        },
        previewContainer: {
            alignItems: 'center',
            paddingVertical: spacing.xl,
            marginBottom: spacing.lg,
        },
        previewIcon: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.xl,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.md,
        },
        previewName: {
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: '600',
        },
        section: {
            marginBottom: spacing.xl,
        },
        sectionTitle: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: spacing.md,
        },
        input: {
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            color: colors.textPrimary,
            fontSize: 16,
        },
        errorText: {
            color: colors.error,
            fontSize: 12,
            marginTop: spacing.xs,
        },
        iconGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
        },
        iconItem: {
            width: 44,
            height: 44,
            borderRadius: borderRadius.md,
            backgroundColor: colors.surfaceSolid,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        colorGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
        },
        colorItem: {
            width: 40,
            height: 40,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
        },
        colorItemSelected: {
            borderWidth: 3,
            borderColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
        },
        footer: {
            padding: spacing.lg,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        createButton: {
            borderRadius: borderRadius.md,
            overflow: 'hidden',
        },
        gradient: {
            paddingVertical: spacing.md,
            alignItems: 'center',
        },
        createButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
    });
