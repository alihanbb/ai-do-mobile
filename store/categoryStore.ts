import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryProps, DEFAULT_CATEGORIES, Category } from '../src/features/category/domain/entities/Category';

interface CategoryState {
    categories: CategoryProps[];
    isLoading: boolean;
    error: string | null;

    // Actions
    initialize: () => void;
    addCategory: (data: { name: string; icon: string; color: string }) => CategoryProps;
    updateCategory: (id: string, updates: Partial<Pick<CategoryProps, 'name' | 'icon' | 'color'>>) => boolean;
    deleteCategory: (id: string) => boolean;
    getCategoryById: (id: string) => CategoryProps | undefined;
    getCategoryColor: (id: string) => string;
    getCategoryIcon: (id: string) => string;
    getCategoryName: (id: string) => string;
    incrementTaskCount: (categoryId: string) => void;
    decrementTaskCount: (categoryId: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            categories: DEFAULT_CATEGORIES,
            isLoading: false,
            error: null,

            initialize: () => {
                const { categories } = get();
                // Varsayılan kategorileri kontrol et ve eksikleri ekle
                const existingIds = categories.map(c => c.id);
                const missingDefaults = DEFAULT_CATEGORIES.filter(d => !existingIds.includes(d.id));

                if (missingDefaults.length > 0) {
                    set({ categories: [...categories, ...missingDefaults] });
                }
            },

            addCategory: (data) => {
                const category = Category.create(data);
                const props = category.toJSON();

                set((state) => ({
                    categories: [...state.categories, props],
                }));

                return props;
            },

            updateCategory: (id, updates) => {
                const category = get().categories.find(c => c.id === id);
                if (!category) return false;

                // Varsayılan kategoriler düzenlenemez
                if (category.isDefault) return false;

                set((state) => ({
                    categories: state.categories.map(c =>
                        c.id === id
                            ? { ...c, ...updates, updatedAt: new Date() }
                            : c
                    ),
                }));

                return true;
            },

            deleteCategory: (id) => {
                const category = get().categories.find(c => c.id === id);
                if (!category || category.isDefault) return false;

                set((state) => ({
                    categories: state.categories.filter(c => c.id !== id),
                }));

                return true;
            },

            getCategoryById: (id) => {
                return get().categories.find(c => c.id === id);
            },

            getCategoryColor: (id) => {
                const category = get().categories.find(c => c.id === id);
                return category?.color || '#6b7280';
            },

            getCategoryIcon: (id) => {
                const category = get().categories.find(c => c.id === id);
                return category?.icon || 'folder';
            },

            getCategoryName: (id) => {
                const category = get().categories.find(c => c.id === id);
                return category?.name || 'Diğer';
            },

            incrementTaskCount: (categoryId) => {
                set((state) => ({
                    categories: state.categories.map(c =>
                        c.id === categoryId
                            ? { ...c, taskCount: c.taskCount + 1 }
                            : c
                    ),
                }));
            },

            decrementTaskCount: (categoryId) => {
                set((state) => ({
                    categories: state.categories.map(c =>
                        c.id === categoryId && c.taskCount > 0
                            ? { ...c, taskCount: c.taskCount - 1 }
                            : c
                    ),
                }));
            },
        }),
        {
            name: 'category-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ categories: state.categories }),
        }
    )
);
