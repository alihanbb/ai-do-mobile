import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, borderRadius } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskCategory, TaskPriority, categoryColors, priorityColors } from '../../types/task';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    X,
    Edit3,
    Trash2,
    Check,
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
    Save,
} from 'lucide-react-native';

const categories: { key: TaskCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'work', label: 'İş', icon: <Briefcase size={18} color={categoryColors.work} /> },
    { key: 'personal', label: 'Kişisel', icon: <User size={18} color={categoryColors.personal} /> },
    { key: 'health', label: 'Sağlık', icon: <Heart size={18} color={categoryColors.health} /> },
    { key: 'education', label: 'Eğitim', icon: <BookOpen size={18} color={categoryColors.education} /> },
    { key: 'shopping', label: 'Alışveriş', icon: <ShoppingCart size={18} color={categoryColors.shopping} /> },
    { key: 'finance', label: 'Finans', icon: <Wallet size={18} color={categoryColors.finance} /> },
    { key: 'social', label: 'Sosyal', icon: <Users size={18} color={categoryColors.social} /> },
    { key: 'other', label: 'Diğer', icon: <Folder size={18} color={categoryColors.other} /> },
];

const priorities: { key: TaskPriority; label: string }[] = [
    { key: 'low', label: 'Düşük' },
    { key: 'medium', label: 'Orta' },
    { key: 'high', label: 'Yüksek' },
    { key: 'urgent', label: 'Acil' },
];

export default function TaskDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { tasks, updateTask, deleteTask, toggleComplete } = useTaskStore();

    const task = tasks.find((t) => t.id === id);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TaskCategory>('personal');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueTime, setDueTime] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setCategory(task.category || 'personal');
            setPriority(task.priority);
            setDueTime(task.dueTime || '');
            setEstimatedDuration(task.estimatedDuration?.toString() || '');
        }
    }, [task]);

    if (!task) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Görev bulunamadı</Text>
                    <Button title="Geri Dön" onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Hata', 'Görev başlığı gerekli');
            return;
        }

        updateTask(task.id, {
            title: title.trim(),
            description: description.trim() || undefined,
            category,
            priority,
            dueTime: dueTime || undefined,
            estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
        });

        setIsEditing(false);
    };

    const handleDelete = () => {
        Alert.alert(
            'Görevi Sil',
            'Bu görevi silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        deleteTask(task.id);
                        router.back();
                    },
                },
            ]
        );
    };

    const categoryColor = task.category ? categoryColors[task.category] : colors.textMuted;
    const priorityColor = priorityColors[task.priority];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <X size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditing ? 'Görevi Düzenle' : 'Görev Detayı'}
                </Text>
                <View style={styles.headerActions}>
                    {isEditing ? (
                        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                            <Save size={24} color={colors.success} />
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => setIsEditing(true)}
                                style={styles.headerButton}
                            >
                                <Edit3 size={22} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                                <Trash2 size={22} color={colors.error} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {isEditing ? (
                    // Edit Mode
                    <>
                        <Input
                            label="Başlık"
                            value={title}
                            onChangeText={setTitle}
                            containerStyle={styles.inputContainer}
                        />

                        <Input
                            label="Açıklama"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            containerStyle={styles.inputContainer}
                        />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Kategori</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.key}
                                        onPress={() => setCategory(cat.key)}
                                        style={[
                                            styles.categoryItem,
                                            category === cat.key && styles.categoryItemSelected,
                                        ]}
                                    >
                                        {cat.icon}
                                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Öncelik</Text>
                            <View style={styles.priorityRow}>
                                {priorities.map((p) => (
                                    <TouchableOpacity
                                        key={p.key}
                                        onPress={() => setPriority(p.key)}
                                        style={[
                                            styles.priorityItem,
                                            priority === p.key && {
                                                backgroundColor: priorityColors[p.key],
                                                borderColor: 'transparent',
                                            },
                                        ]}
                                    >
                                        <Text style={[
                                            styles.priorityLabel,
                                            priority === p.key && { color: colors.textPrimary },
                                        ]}>
                                            {p.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Saat"
                                    placeholder="14:00"
                                    value={dueTime}
                                    onChangeText={setDueTime}
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Input
                                    label="Süre (dk)"
                                    placeholder="30"
                                    value={estimatedDuration}
                                    onChangeText={setEstimatedDuration}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </>
                ) : (
                    // View Mode
                    <>
                        <Card variant="default" padding="lg" style={styles.mainCard}>
                            <TouchableOpacity
                                onPress={() => toggleComplete(task.id)}
                                style={styles.completeRow}
                            >
                                <View style={[
                                    styles.checkbox,
                                    task.completed && styles.checkboxCompleted,
                                ]}>
                                    {task.completed && (
                                        <Check size={16} color={colors.textPrimary} strokeWidth={3} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.taskTitle,
                                    task.completed && styles.taskTitleCompleted,
                                ]}>
                                    {task.title}
                                </Text>
                            </TouchableOpacity>

                            {task.description && (
                                <Text style={styles.description}>{task.description}</Text>
                            )}

                            <View style={styles.metaGrid}>
                                {task.category && (
                                    <View style={styles.metaItem}>
                                        <Tag size={16} color={categoryColor} />
                                        <Text style={[styles.metaText, { color: categoryColor }]}>
                                            {categories.find((c) => c.key === task.category)?.label}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.metaItem}>
                                    <Flag size={16} color={priorityColor} />
                                    <Text style={[styles.metaText, { color: priorityColor }]}>
                                        {priorities.find((p) => p.key === task.priority)?.label}
                                    </Text>
                                </View>
                                {task.dueTime && (
                                    <View style={styles.metaItem}>
                                        <Clock size={16} color={colors.textSecondary} />
                                        <Text style={styles.metaText}>{task.dueTime}</Text>
                                    </View>
                                )}
                                {task.estimatedDuration && (
                                    <View style={styles.metaItem}>
                                        <Calendar size={16} color={colors.textSecondary} />
                                        <Text style={styles.metaText}>{task.estimatedDuration} dk</Text>
                                    </View>
                                )}
                            </View>
                        </Card>

                        <View style={styles.actions}>
                            <Button
                                title={task.completed ? 'Tamamlanmadı İşaretle' : 'Tamamlandı İşaretle'}
                                variant={task.completed ? 'secondary' : 'primary'}
                                onPress={async () => { await toggleComplete(task.id); }}
                                fullWidth
                                icon={<Check size={20} color={colors.textPrimary} />}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    headerButton: {
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
    headerActions: {
        flexDirection: 'row',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
    },
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
    },
    notFoundText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: spacing.lg,
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
        borderColor: colors.primary,
        borderWidth: 2,
    },
    categoryLabel: {
        color: colors.textSecondary,
        fontSize: 13,
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
    priorityLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    mainCard: {
        marginBottom: spacing.xl,
    },
    completeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    checkboxCompleted: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    taskTitle: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '600',
    },
    taskTitleCompleted: {
        color: colors.textMuted,
        textDecorationLine: 'line-through',
    },
    description: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    actions: {
        gap: spacing.md,
    },
});
