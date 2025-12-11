import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskCategory, TaskPriority, categoryColors, priorityColors } from '../../types/task';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    X,
    Calendar,
    Clock,
    Tag,
    Flag,
    FileText,
    Briefcase,
    User,
    Heart,
    BookOpen,
    ShoppingCart,
    Wallet,
    Users,
    Folder,
} from 'lucide-react-native';

const categories: { key: TaskCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'work', label: 'İş', icon: <Briefcase size={20} color={categoryColors.work} /> },
    { key: 'personal', label: 'Kişisel', icon: <User size={20} color={categoryColors.personal} /> },
    { key: 'health', label: 'Sağlık', icon: <Heart size={20} color={categoryColors.health} /> },
    { key: 'education', label: 'Eğitim', icon: <BookOpen size={20} color={categoryColors.education} /> },
    { key: 'shopping', label: 'Alışveriş', icon: <ShoppingCart size={20} color={categoryColors.shopping} /> },
    { key: 'finance', label: 'Finans', icon: <Wallet size={20} color={categoryColors.finance} /> },
    { key: 'social', label: 'Sosyal', icon: <Users size={20} color={categoryColors.social} /> },
    { key: 'other', label: 'Diğer', icon: <Folder size={20} color={categoryColors.other} /> },
];

const priorities: { key: TaskPriority; label: string }[] = [
    { key: 'low', label: 'Düşük' },
    { key: 'medium', label: 'Orta' },
    { key: 'high', label: 'Yüksek' },
    { key: 'urgent', label: 'Acil' },
];

export default function CreateTaskScreen() {
    const router = useRouter();
    const { addTask } = useTaskStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TaskCategory>('personal');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueTime, setDueTime] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (!title.trim()) {
            setError('Görev başlığı gerekli');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim() || undefined,
            completed: false,
            dueDate: new Date(),
            dueTime: dueTime || undefined,
            category,
            priority,
            estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        addTask(newTask);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Yeni Görev</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title */}
                    <Input
                        label="Başlık"
                        placeholder="Görev başlığı"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            setError('');
                        }}
                        icon={<FileText size={18} color={colors.textMuted} />}
                        containerStyle={styles.inputContainer}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {/* Description */}
                    <Input
                        label="Açıklama (Opsiyonel)"
                        placeholder="Görev detayları..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        containerStyle={styles.inputContainer}
                    />

                    {/* Category */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Tag size={16} color={colors.textSecondary} /> Kategori
                        </Text>
                        <View style={styles.categoryGrid}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.key}
                                    onPress={() => setCategory(cat.key)}
                                    style={[
                                        styles.categoryItem,
                                        category === cat.key && styles.categoryItemSelected,
                                        category === cat.key && { borderColor: categoryColors[cat.key] },
                                    ]}
                                >
                                    {cat.icon}
                                    <Text style={[
                                        styles.categoryLabel,
                                        category === cat.key && { color: categoryColors[cat.key] },
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Priority */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Flag size={16} color={colors.textSecondary} /> Öncelik
                        </Text>
                        <View style={styles.priorityRow}>
                            {priorities.map((p) => (
                                <TouchableOpacity
                                    key={p.key}
                                    onPress={() => setPriority(p.key)}
                                    style={[
                                        styles.priorityItem,
                                        priority === p.key && styles.priorityItemSelected,
                                        priority === p.key && { backgroundColor: priorityColors[p.key] },
                                    ]}
                                >
                                    <Text style={[
                                        styles.priorityLabel,
                                        priority === p.key && styles.priorityLabelSelected,
                                    ]}>
                                        {p.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Time & Duration */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Input
                                label="Saat"
                                placeholder="14:00"
                                value={dueTime}
                                onChangeText={setDueTime}
                                icon={<Clock size={18} color={colors.textMuted} />}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Input
                                label="Süre (dk)"
                                placeholder="30"
                                value={estimatedDuration}
                                onChangeText={setEstimatedDuration}
                                keyboardType="numeric"
                                icon={<Calendar size={18} color={colors.textMuted} />}
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* Create Button */}
                <View style={styles.footer}>
                    <Button
                        title="Görev Oluştur"
                        onPress={handleCreate}
                        fullWidth
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
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
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginBottom: spacing.md,
        marginTop: -spacing.sm,
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
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceSolid,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryItemSelected: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 2,
    },
    categoryLabel: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    priorityRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    priorityItem: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceSolid,
        borderWidth: 1,
        borderColor: colors.border,
    },
    priorityItemSelected: {
        borderColor: 'transparent',
    },
    priorityLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    priorityLabelSelected: {
        color: colors.textPrimary,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});
