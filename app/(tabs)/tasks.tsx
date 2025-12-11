import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Platform,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useTaskStore } from '../../store/taskStore';
import { SwipeableTaskCard } from '../../components/task/SwipeableTaskCard';
import { SearchBar, FilterModal } from '../../components/task/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { TaskCategory, TaskPriority } from '../../types/task';
import { Plus, ListTodo, Search } from 'lucide-react-native';

export default function TasksScreen() {
    const router = useRouter();
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { tasks, toggleComplete, deleteTask } = useTaskStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<TaskCategory[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>([]);

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = task.title.toLowerCase().includes(query);
                const matchesDescription = task.description?.toLowerCase().includes(query);
                if (!matchesTitle && !matchesDescription) return false;
            }

            // Category filter
            if (selectedCategories.length > 0) {
                if (!task.category || !selectedCategories.includes(task.category)) {
                    return false;
                }
            }

            // Priority filter
            if (selectedPriorities.length > 0) {
                if (!selectedPriorities.includes(task.priority)) {
                    return false;
                }
            }

            return true;
        });
    }, [tasks, searchQuery, selectedCategories, selectedPriorities]);

    const pendingTasks = filteredTasks.filter((t) => !t.completed);
    const completedTasks = filteredTasks.filter((t) => t.completed);

    const activeFilters = selectedCategories.length + selectedPriorities.length;

    const handleCategoryToggle = (category: TaskCategory) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handlePriorityToggle = (priority: TaskPriority) => {
        setSelectedPriorities((prev) =>
            prev.includes(priority)
                ? prev.filter((p) => p !== priority)
                : [...prev, priority]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedPriorities([]);
    };

    const handleDelete = (taskId: string, taskTitle: string) => {
        Alert.alert(
            'Görevi Sil',
            `"${taskTitle}" görevini silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => deleteTask(taskId),
                },
            ]
        );
    };

    const styles = createStyles(colors);

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Görevler</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/task/create')}
                    >
                        <Plus size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFilterPress={() => setFilterModalVisible(true)}
                    activeFilters={activeFilters}
                />

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{pendingTasks.length}</Text>
                        <Text style={styles.statLabel}>Bekleyen</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.success }]}>
                            {completedTasks.length}
                        </Text>
                        <Text style={styles.statLabel}>Tamamlanan</Text>
                    </View>
                </View>

                {/* Task List */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Pending Tasks */}
                    {pendingTasks.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Bekleyen ({pendingTasks.length})
                            </Text>
                            {pendingTasks.map((task) => (
                                <SwipeableTaskCard
                                    key={task.id}
                                    task={task}
                                    onPress={() => router.push(`/task/${task.id}`)}
                                    onToggleComplete={() => toggleComplete(task.id)}
                                    onDelete={() => handleDelete(task.id, task.title)}
                                />
                            ))}
                        </View>
                    )}

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Tamamlanan ({completedTasks.length})
                            </Text>
                            {completedTasks.map((task) => (
                                <SwipeableTaskCard
                                    key={task.id}
                                    task={task}
                                    onPress={() => router.push(`/task/${task.id}`)}
                                    onToggleComplete={() => toggleComplete(task.id)}
                                    onDelete={() => handleDelete(task.id, task.title)}
                                />
                            ))}
                        </View>
                    )}

                    {/* Empty State */}
                    {filteredTasks.length === 0 && (
                        <EmptyState
                            icon={searchQuery || activeFilters > 0 ? Search : ListTodo}
                            title={searchQuery || activeFilters > 0
                                ? 'Görev bulunamadı'
                                : 'Henüz görev yok'}
                            description={searchQuery || activeFilters > 0
                                ? 'Farklı bir arama veya filtre deneyin'
                                : '+ butonuna tıklayarak yeni görev ekleyin'}
                            actionLabel={searchQuery || activeFilters > 0 ? undefined : 'Görev Ekle'}
                            onAction={searchQuery || activeFilters > 0 ? undefined : () => router.push('/task/create')}
                            iconColor={colors.primary}
                        />
                    )}
                </ScrollView>

                {/* Filter Modal */}
                <FilterModal
                    visible={filterModalVisible}
                    onClose={() => setFilterModalVisible(false)}
                    selectedCategories={selectedCategories}
                    selectedPriorities={selectedPriorities}
                    onCategoryToggle={handleCategoryToggle}
                    onPriorityToggle={handlePriorityToggle}
                    onClearFilters={handleClearFilters}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: Platform.OS === 'android' ? spacing.lg + (StatusBar.currentHeight || 24) : spacing.lg,
            paddingBottom: spacing.md,
        },
        title: {
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: 'bold',
        },
        addButton: {
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        stats: {
            flexDirection: 'row',
            marginHorizontal: spacing.lg,
            marginBottom: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.surfaceSolid,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            borderColor: colors.border,
        },
        statItem: {
            flex: 1,
            alignItems: 'center',
        },
        statNumber: {
            color: colors.textPrimary,
            fontSize: 24,
            fontWeight: 'bold',
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: spacing.xs,
        },
        statDivider: {
            width: 1,
            backgroundColor: colors.border,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            padding: spacing.lg,
            paddingTop: 0,
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
            letterSpacing: 0.5,
        },
    });

