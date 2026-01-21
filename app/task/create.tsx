import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TextInput,
    Modal,
    StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';
import { getColors, spacing, borderRadius } from '../../constants/colors';
import { useTaskStore } from '../../src/features/task/presentation/stores/useTaskStore';
import { useCategoryStore } from '../../store/categoryStore';
import { TaskPriority } from '../../types/task';
import { AddCategoryModal } from '../../components/category/AddCategoryModal';
import {
    X,
    Calendar,
    Flag,
    Folder,
    Plus,
    Bell,
    ChevronDown,
    Briefcase,
    User,
    Heart,
    BookOpen,
    ShoppingCart,
    Wallet,
    Users,
    Home,
    Star,
    Music,
    Camera,
    Coffee,
    Gift,
    Globe,
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
    ChevronLeft,
    ChevronRight,
} from 'lucide-react-native';

const iconComponents: Record<string, any> = {
    'briefcase': Briefcase, 'user': User, 'heart': Heart, 'book-open': BookOpen,
    'shopping-cart': ShoppingCart, 'wallet': Wallet, 'users': Users, 'folder': Folder,
    'home': Home, 'star': Star, 'music': Music, 'camera': Camera, 'coffee': Coffee,
    'gift': Gift, 'globe': Globe, 'flag': Flag, 'zap': Zap, 'target': Target,
    'trophy': Trophy, 'gamepad-2': Gamepad2, 'plane': Plane, 'car': Car,
    'utensils': Utensils, 'dumbbell': Dumbbell, 'palette': Palette, 'code': Code,
    'lightbulb': Lightbulb,
};

export default function CreateTaskScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ category?: string }>();
    const { isDark } = useThemeStore();
    const { t, i18n } = useTranslation();
    const colors = getColors(isDark);
    const { createTask } = useTaskStore();
    const { categories, incrementTaskCount } = useCategoryStore();

    // Dynamic priority config based on language
    const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
        low: { label: i18n.language === 'en' ? 'Low' : 'Düşük', color: '#6b7280' },
        medium: { label: i18n.language === 'en' ? 'Medium' : 'Orta', color: '#3b82f6' },
        high: { label: i18n.language === 'en' ? 'High' : 'Yüksek', color: '#f59e0b' },
        urgent: { label: i18n.language === 'en' ? 'Urgent' : 'Acil', color: '#ef4444' },
    };

    // Dynamic days and months
    const DAYS = i18n.language === 'en'
        ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        : ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
    const MONTHS = i18n.language === 'en'
        ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        : ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>(params.category || 'personal');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderDateTime, setReminderDateTime] = useState<Date>(new Date());

    // Modal States
    const [dateModalType, setDateModalType] = useState<'dueDate' | 'reminder' | null>(null);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    // Custom Time Picker States
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempTime, setTempTime] = useState<Date>(new Date());
    const [timeMode, setTimeMode] = useState<'hour' | 'minute'>('hour');

    // UI States
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (params.category) setCategory(params.category);
    }, [params.category]);

    const selectedCat = categories.find(c => c.id === category);

    // Helpers
    const formatDate = (date: Date | null) => {
        if (!date) return 'Tarih seç';
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        if (dateOnly.getTime() === todayDate.getTime()) return t('tasks.today');
        if (dateOnly.getTime() === tomorrow.getTime()) return t('calendar.tomorrow') || 'Yarın';
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'short' });
    };

    const formatFullDate = (date: Date) => {
        const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        return `${days[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
    };

    const formatTime = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const days: (number | null)[] = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        while (days.length % 7 !== 0) days.push(null);
        return days;
    };

    const isTodayDate = (day: number) => {
        const today = new Date();
        return day === today.getDate() && calendarMonth.getMonth() === today.getMonth() && calendarMonth.getFullYear() === today.getFullYear();
    };

    const isSelectedDate = (day: number) => {
        return day === tempDate.getDate() && calendarMonth.getMonth() === tempDate.getMonth() && calendarMonth.getFullYear() === tempDate.getFullYear();
    };

    // Date Modal Handlers
    const openDateModal = (type: 'dueDate' | 'reminder') => {
        const baseDate = type === 'dueDate' ? (dueDate || new Date()) : (reminderEnabled ? reminderDateTime : new Date());
        setTempDate(baseDate);
        setCalendarMonth(baseDate);
        if (type === 'reminder') {
            setTempTime(baseDate);
            setTimeMode('hour');
        }
        setDateModalType(type);
    };

    const confirmDateSelection = () => {
        if (dateModalType === 'dueDate') {
            setDueDate(tempDate);
            setDateModalType(null);
        } else if (dateModalType === 'reminder') {
            setDateModalType(null);
            setShowTimePicker(true);
        }
    };

    // Custom Time Picker Logic (Clock Face)
    const handleClockSelect = (value: number) => {
        const newTime = new Date(tempTime);
        if (timeMode === 'hour') {
            newTime.setHours(value);
            setTempTime(newTime);
            setTimeMode('minute');
        } else {
            newTime.setMinutes(value);
            setTempTime(newTime);
        }
    };

    const handleTimeConfirm = () => {
        const finalDateTime = new Date(tempDate);
        finalDateTime.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
        setReminderDateTime(finalDateTime);
        setReminderEnabled(true);
        setShowTimePicker(false);
    };

    // Render Clock Face
    const renderClockFace = () => {
        const radius = 100;
        const center = 110;
        const numbers = timeMode === 'hour'
            ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

        const innerNumbers = timeMode === 'hour'
            ? [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            : [];

        const renderNumber = (num: number, index: number, isInner = false) => {
            const angle = (index * 30 - 90) * (Math.PI / 180);
            const dist = isInner ? radius * 0.65 : radius;
            const x = center + dist * Math.cos(angle);
            const y = center + dist * Math.sin(angle);

            const currentValue = timeMode === 'hour' ? tempTime.getHours() : tempTime.getMinutes();
            let isSelected = currentValue === num;
            if (timeMode === 'minute') {
                if (Math.abs(currentValue - num) < 3 && num % 5 === 0) isSelected = true;
            }

            return (
                <TouchableOpacity
                    key={`${isInner ? 'in' : 'out'}-${num}`}
                    style={[
                        styles.clockNumberBtn,
                        { left: x - 18, top: y - 18 },
                        isSelected && { backgroundColor: colors.accent }
                    ]}
                    onPress={() => handleClockSelect(num)}
                >
                    <Text style={[styles.clockNumberText, isSelected && { fontWeight: 'bold', color: '#fff' }]}>
                        {timeMode === 'minute' ? String(num).padStart(2, '0') : num === 0 && !isInner ? 12 : num}
                    </Text>
                </TouchableOpacity>
            );
        };

        return (
            <View style={styles.clockFaceContainer}>
                <View style={[styles.clockCenterDot, { backgroundColor: colors.accent }]} />
                {numbers.map((num, i) => renderNumber(num, i))}
                {innerNumbers.map((num, i) => renderNumber(num, num === 0 ? 0 : num - 12, true))}
            </View>
        );
    };

    const handleCreate = async () => {
        console.log('🔥 handleCreate CALLED! title:', title);
        if (!title.trim()) {
            console.log('❌ Title is empty');
            Alert.alert(t('common.error'), t('tasks.titleRequired') || 'Görev başlığı gerekli');
            return;
        }
        setIsLoading(true);
        console.log('📤 Sending task to createTask...');
        try {
            const success = await createTask({
                title: title.trim(),
                description: description.trim() || undefined,
                dueDate: dueDate || undefined,
                category: category as any,
                priority,
                reminder: reminderEnabled ? reminderDateTime : undefined,
            });
            console.log('✅ createTask result:', success);
            if (success) {
                incrementTaskCount(category);
                router.back();
            } else {
                Alert.alert('Hata', 'Görev oluşturulamadı');
            }
        } catch (e) {
            console.error('❌ handleCreate error:', e);
            Alert.alert('Hata', 'Görev oluşturulamadı');
        } finally {
            setIsLoading(false);
        }
    };

    const renderIcon = (iconName: string, color: string, size = 18) => {
        const Icon = iconComponents[iconName] || Folder;
        return <Icon size={size} color={color} />;
    };

    const styles = createStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                        <X size={22} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('tasks.newTask')}</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Content */}
                <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder={t('tasks.taskTitle')}
                        placeholderTextColor={colors.textMuted}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                        selectionColor={colors.primary}
                        autoCorrect={false}
                        autoComplete="off"
                    />
                    <TextInput
                        style={styles.descInput}
                        placeholder={t('tasks.description')}
                        placeholderTextColor={colors.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        selectionColor={colors.primary}
                        autoCorrect={false}
                        autoComplete="off"
                    />

                    <View style={styles.optionsContainer}>
                        {/* Category */}
                        <TouchableOpacity style={styles.optionRow} onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
                            <View style={styles.optionLeft}>
                                {selectedCat && renderIcon(selectedCat.icon, selectedCat.color)}
                                <Text style={styles.optionLabel}>{t('tasks.category')}</Text>
                            </View>
                            <View style={styles.optionRight}>
                                <Text style={[styles.optionValue, { color: selectedCat?.color }]}>
                                    {selectedCat ? t(`categories.${selectedCat.id}`, { defaultValue: selectedCat.name }) : t('common.select')}
                                </Text>
                                <ChevronDown size={16} color={colors.textMuted} />
                            </View>
                        </TouchableOpacity>

                        {showCategoryPicker && (
                            <View style={styles.pickerContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.pickerChip,
                                                category === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }
                                            ]}
                                            onPress={() => { setCategory(cat.id); setShowCategoryPicker(false); }}
                                        >
                                            {renderIcon(cat.icon, cat.color, 16)}
                                            <Text style={[styles.pickerChipText, category === cat.id && { color: cat.color }]}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity style={styles.pickerChipAdd} onPress={() => { setShowCategoryPicker(false); setShowAddCategoryModal(true); }}>
                                        <Plus size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        )}

                        {/* Priority */}
                        <TouchableOpacity style={styles.optionRow} onPress={() => setShowPriorityPicker(!showPriorityPicker)}>
                            <View style={styles.optionLeft}>
                                <Flag size={18} color={priorityConfig[priority].color} />
                                <Text style={styles.optionLabel}>{t('tasks.priority')}</Text>
                            </View>
                            <View style={styles.optionRight}>
                                <View style={[styles.priorityDot, { backgroundColor: priorityConfig[priority].color }]} />
                                <Text style={[styles.optionValue, { color: priorityConfig[priority].color }]}>{priorityConfig[priority].label}</Text>
                                <ChevronDown size={16} color={colors.textMuted} />
                            </View>
                        </TouchableOpacity>

                        {showPriorityPicker && (
                            <View style={styles.pickerContainer}>
                                <View style={styles.priorityRow}>
                                    {(Object.keys(priorityConfig) as TaskPriority[]).map((p) => (
                                        <TouchableOpacity
                                            key={p}
                                            style={[
                                                styles.priorityChip,
                                                priority === p && {
                                                    backgroundColor: priorityConfig[p].color + '20',
                                                    borderColor: priorityConfig[p].color
                                                }
                                            ]}
                                            onPress={() => { setPriority(p); setShowPriorityPicker(false); }}
                                        >
                                            <View style={[styles.priorityDotSmall, { backgroundColor: priorityConfig[p].color }]} />
                                            <Text style={[
                                                styles.priorityChipText,
                                                { color: priority === p ? priorityConfig[p].color : colors.textSecondary }
                                            ]}>
                                                {priorityConfig[p].label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Due Date (Yeşil Tema) */}
                        <TouchableOpacity style={styles.optionRow} onPress={() => openDateModal('dueDate')}>
                            <View style={styles.optionLeft}>
                                <Calendar size={18} color={dueDate ? colors.success : colors.textMuted} />
                                <Text style={styles.optionLabel}>{t('tasks.dueDate')}</Text>
                            </View>
                            <View style={styles.optionRight}>
                                <Text style={[styles.optionValue, dueDate && { color: colors.success }]}>
                                    {formatDate(dueDate) === 'Tarih seç' ? t('common.selectDate') || 'Tarih seç' : formatDate(dueDate)}
                                </Text>
                                {dueDate && (
                                    <TouchableOpacity onPress={() => setDueDate(null)} style={styles.clearBtn}>
                                        <X size={14} color={colors.textMuted} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Reminder (Pembe Tema) */}
                        <TouchableOpacity style={[styles.optionRow, { borderBottomWidth: 0 }]} onPress={() => openDateModal('reminder')}>
                            <View style={styles.optionLeft}>
                                <Bell size={18} color={reminderEnabled ? colors.accent : colors.textMuted} />
                                <Text style={styles.optionLabel}>{t('tasks.reminder')}</Text>
                            </View>
                            <View style={styles.optionRight}>
                                {reminderEnabled ? (
                                    <>
                                        <Text style={[styles.optionValue, { color: colors.accent }]}>
                                            {formatFullDate(reminderDateTime)}, {formatTime(reminderDateTime)}
                                        </Text>
                                        <TouchableOpacity onPress={() => setReminderEnabled(false)} style={styles.clearBtn}>
                                            <X size={14} color={colors.textMuted} />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <Text style={styles.optionValue}>{t('common.add') || 'Ekle'}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.createBtn, (!title.trim() || isLoading) && styles.createBtnDisabled]}
                        onPress={handleCreate}
                        disabled={isLoading || !title.trim()}
                    >
                        <LinearGradient
                            colors={title.trim() ? [colors.primary, colors.primaryDark] : [colors.surfaceSolid, colors.surfaceSolid]}
                            style={styles.createBtnGradient}
                        >
                            <Plus size={20} color={title.trim() ? "#fff" : colors.textMuted} />
                            <Text style={[styles.createBtnText, !title.trim() && { color: colors.textMuted }]}>{t('tasks.addTask')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Calendar Modal */}
                <Modal visible={dateModalType !== null} transparent animationType="fade" onRequestClose={() => setDateModalType(null)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeaderTitle}>
                                {dateModalType === 'dueDate' ? 'Bitiş Tarihi' : 'Hatırlatma Tarihi'}
                            </Text>
                            <Text style={[
                                styles.modalSelectedDate,
                                { color: dateModalType === 'reminder' ? colors.accent : colors.success }
                            ]}>
                                {formatFullDate(tempDate)}
                            </Text>

                            <View style={styles.calendarHeader}>
                                <Text style={styles.calendarMonthText}>
                                    {MONTHS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                                </Text>
                                <View style={styles.calendarNavRow}>
                                    <TouchableOpacity
                                        onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                        style={styles.calendarNavBtn}
                                    >
                                        <ChevronLeft size={24} color={colors.textPrimary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                        style={styles.calendarNavBtn}
                                    >
                                        <ChevronRight size={24} color={colors.textPrimary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.dayNamesRow}>
                                {DAYS.map(day => <Text key={day} style={styles.dayNameText}>{day}</Text>)}
                            </View>

                            <View style={styles.calendarGrid}>
                                {getDaysInMonth(calendarMonth).map((day, i) => {
                                    if (!day) return <View key={i} style={styles.dayCell} />;
                                    const isSelected = isSelectedDate(day);
                                    const isToday = isTodayDate(day);
                                    const accent = dateModalType === 'reminder' ? colors.accent : colors.success;
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.dayCell}
                                            onPress={() => {
                                                const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                                                setTempDate(newDate);
                                            }}
                                        >
                                            <View style={[
                                                styles.dayInner,
                                                isSelected && { backgroundColor: accent },
                                                isToday && !isSelected && { borderWidth: 1, borderColor: accent }
                                            ]}>
                                                <Text style={[styles.dayText, isSelected && { fontWeight: 'bold', color: '#fff' }]}>{day}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setDateModalType(null)}>
                                    <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmDateSelection}>
                                    <Text style={[
                                        styles.modalOkText,
                                        { color: dateModalType === 'reminder' ? colors.accent : colors.success }
                                    ]}>

                                        {t('common.ok')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* CUSTOM TIME PICKER MODAL (Hatırlatma için Pembe Tema) */}
                <Modal visible={showTimePicker} transparent animationType="fade" onRequestClose={() => setShowTimePicker(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.timeModalContainer}>
                            {/* Header */}
                            <View style={[styles.timeModalHeader, { backgroundColor: colors.accent }]}>
                                <Text style={styles.timeModalHeaderLabel}>{t('common.selectTime') || 'Saat Seç'}</Text>
                                <View style={styles.timeModalDisplay}>
                                    <TouchableOpacity onPress={() => setTimeMode('hour')}>
                                        <Text style={[styles.timeModalDisplayText, timeMode === 'hour' ? styles.timeActive : styles.timeInactive]}>
                                            {String(tempTime.getHours()).padStart(2, '0')}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.timeModalColon}>:</Text>
                                    <TouchableOpacity onPress={() => setTimeMode('minute')}>
                                        <Text style={[styles.timeModalDisplayText, timeMode === 'minute' ? styles.timeActive : styles.timeInactive]}>
                                            {String(tempTime.getMinutes()).padStart(2, '0')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Clock Face */}
                            <View style={styles.clockFaceWrapper}>
                                {renderClockFace()}
                            </View>

                            {/* Footer */}
                            <View style={styles.timeModalFooter}>
                                <TouchableOpacity onPress={() => {
                                    if (timeMode === 'minute') setTimeMode('hour');
                                    else {
                                        setShowTimePicker(false);
                                        setDateModalType('reminder');
                                    }
                                }}>
                                    <Text style={styles.timeModalCancelBtn}>{t('common.back').toUpperCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleTimeConfirm}>
                                    <Text style={[styles.timeModalOkBtn, { color: colors.accent }]}>{t('common.ok').toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <AddCategoryModal visible={showAddCategoryModal} onClose={() => setShowAddCategoryModal(false)} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof getColors>) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + spacing.md : spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    headerBtn: { padding: spacing.sm },
    headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
    saveBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: 12
    },
    saveBtnDisabled: { opacity: 0.4 },
    saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

    // Content
    content: { padding: spacing.lg },
    titleInput: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.sm
    },
    descInput: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        minHeight: 60
    },

    // Options Container
    optionsContainer: {
        backgroundColor: colors.card,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    optionLabel: { fontSize: 16, color: colors.textPrimary },
    optionRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    optionValue: { fontSize: 14, color: colors.textMuted },
    clearBtn: { padding: 4, marginLeft: 4 },

    // Picker Container
    pickerContainer: {
        padding: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderColor: colors.border
    },
    pickerChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 8,
        backgroundColor: colors.card,
    },
    pickerChipText: { fontSize: 14, color: colors.textSecondary },
    pickerChipAdd: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Priority
    priorityRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    priorityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
        minWidth: 70,
    },
    priorityChipText: { fontSize: 13, fontWeight: '500' },
    priorityDot: { width: 8, height: 8, borderRadius: 4 },
    priorityDotSmall: { width: 6, height: 6, borderRadius: 3 },

    // Footer
    footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
    createBtn: { borderRadius: 16, overflow: 'hidden' },
    createBtnDisabled: { opacity: 0.4 },
    createBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: 16
    },
    createBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

    // Modal Common
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: colors.surfaceSolid,
        borderRadius: 24,
        padding: 24,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5
    },
    modalHeaderTitle: { color: colors.textMuted, fontSize: 14, marginBottom: 4 },
    modalSelectedDate: { fontSize: 24, fontWeight: '500', marginBottom: 20 },

    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 30, marginTop: 24 },
    modalCancelText: { color: colors.textMuted, fontWeight: '600', fontSize: 15 },
    modalOkText: { fontWeight: 'bold', fontSize: 15 },

    // Calendar
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    calendarMonthText: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
    calendarNavRow: { flexDirection: 'row', gap: 16 },
    calendarNavBtn: { padding: 4 },
    dayNamesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    dayNameText: { color: colors.textMuted, width: 36, textAlign: 'center', fontSize: 13 },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    dayCell: {
        width: '13%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4
    },
    dayInner: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayText: { color: colors.textPrimary, fontSize: 14 },

    // Custom Time Picker
    timeModalContainer: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: colors.surfaceSolid,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5
    },
    timeModalHeader: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeModalHeaderLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 10,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 1
    },
    timeModalDisplay: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    timeModalDisplayText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff'
    },
    timeModalColon: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 8,
        marginHorizontal: 4
    },
    timeActive: { opacity: 1 },
    timeInactive: { opacity: 0.5 },
    clockFaceWrapper: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },
    clockFaceContainer: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: colors.surfaceSolid,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    clockCenterDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        zIndex: 10
    },
    clockNumberBtn: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    clockNumberText: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: '500'
    },
    timeModalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 24,
        gap: 30
    },
    timeModalCancelBtn: {
        color: colors.textMuted,
        fontWeight: 'bold',
        fontSize: 14
    },
    timeModalOkBtn: {
        fontWeight: 'bold',
        fontSize: 14
    }
});
