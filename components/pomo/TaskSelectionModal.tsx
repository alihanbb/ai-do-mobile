import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
} from 'react-native';
import { X, Search, CheckCircle2 } from 'lucide-react-native';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useTaskStore } from '../../src/features/task/presentation/stores/useTaskStore';
import { TaskProps } from '../../src/features/task/domain/entities/Task';

interface TaskSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectTask: (taskId: string, taskTitle: string) => void;
    selectedTaskId?: string;
}

type TabType = 'task' | 'habit';

export const TaskSelectionModal: React.FC<TaskSelectionModalProps> = ({
    visible,
    onClose,
    onSelectTask,
    selectedTaskId,
}) => {
    const { isDark } = useThemeStore();
    const colors = getColors(isDark);
    const { tasks } = useTaskStore();

    const [activeTab, setActiveTab] = useState<TabType>('task');
    const [searchQuery, setSearchQuery] = useState('');

    const styles = createStyles(colors);

    const filteredTasks = tasks.filter((task) => {
        if (searchQuery.trim()) {
            return task.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const pendingTasks = filteredTasks.filter((t) => !t.completed);
    const completedTasks = filteredTasks.filter((t) => t.completed);

    const handleSelectTask = (task: TaskProps) => {
        onSelectTask(task.id, task.title);
        onClose();
    };

    const renderTaskItem = ({ item }: { item: TaskProps }) => {
        const isSelected = item.id === selectedTaskId;
        return (
            <TouchableOpacity
                style={[styles.taskItem, isSelected && styles.taskItemSelected]}
                onPress={() => handleSelectTask(item)}
            >
                <View style={styles.taskCheckbox}>
                    {isSelected ? (
                        <CheckCircle2 size={20} color={colors.primary} />
                    ) : (
                        <View style={styles.emptyCheckbox} />
                    )}
                </View>
                <Text
                    style={[styles.taskTitle, isSelected && styles.taskTitleSelected]}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                {item.dueDate && (
                    <Text style={styles.taskDate}>
                        {new Date(item.dueDate).toLocaleDateString('tr-TR', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = (title: string, count: number) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity>
                <Text style={styles.sectionToggle}>▼</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'task' && styles.tabActive]}
                            onPress={() => setActiveTab('task')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'task' && styles.tabTextActive,
                                ]}
                            >
                                Görev
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'habit' && styles.tabActive]}
                            onPress={() => setActiveTab('habit')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'habit' && styles.tabTextActive,
                                ]}
                            >
                                Alışkanlık
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search size={18} color={colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Arama"
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>Bugün</Text>
                    <Text style={styles.infoArrow}>›</Text>
                </View>
                <Text style={styles.helperText}>
                    Odaklanmak için bir pomodoro başlatmak için bir görev seçebilirsiniz.
                </Text>

                {/* Task List */}
                <FlatList
                    data={pendingTasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTaskItem}
                    ListHeaderComponent={() => (
                        <>
                            {pendingTasks.length > 0 && renderSectionHeader('ALIŞTANLIK', pendingTasks.length)}
                        </>
                    )}
                    ListFooterComponent={() => (
                        <>
                            {completedTasks.length > 0 && (
                                <>
                                    {renderSectionHeader('TAMAMLANDI.', completedTasks.length)}
                                    {completedTasks.map((task) => (
                                        <View key={task.id}>
                                            {renderTaskItem({ item: task })}
                                        </View>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Modal>
    );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xxl,
            paddingBottom: spacing.md,
            gap: spacing.lg,
        },
        tabs: {
            flexDirection: 'row',
            gap: spacing.md,
        },
        tab: {
            paddingBottom: spacing.xs,
        },
        tabActive: {
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
        },
        tabText: {
            fontSize: 16,
            color: colors.textMuted,
        },
        tabTextActive: {
            color: colors.primary,
            fontWeight: '600',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceSolid,
            marginHorizontal: spacing.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.lg,
            gap: spacing.sm,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.textPrimary,
        },
        infoBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            gap: spacing.sm,
        },
        infoIcon: {
            fontSize: 16,
        },
        infoText: {
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: '500',
        },
        infoArrow: {
            fontSize: 20,
            color: colors.textMuted,
        },
        helperText: {
            fontSize: 14,
            color: colors.textMuted,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            backgroundColor: colors.surfaceSolid,
        },
        sectionTitle: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textMuted,
            letterSpacing: 0.5,
        },
        sectionToggle: {
            fontSize: 12,
            color: colors.textMuted,
        },
        listContent: {
            paddingBottom: spacing.xxxl,
        },
        taskItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            gap: spacing.md,
        },
        taskItemSelected: {
            backgroundColor: colors.primary + '10',
        },
        taskCheckbox: {
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyCheckbox: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: colors.border,
        },
        taskTitle: {
            flex: 1,
            fontSize: 16,
            color: colors.textPrimary,
        },
        taskTitleSelected: {
            color: colors.primary,
            fontWeight: '500',
        },
        taskDate: {
            fontSize: 12,
            color: colors.textMuted,
        },
    });
