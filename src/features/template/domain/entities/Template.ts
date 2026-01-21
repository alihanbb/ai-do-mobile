import { TaskPriority, TaskStatus, TaskCategory } from '../../../task/domain/entities/Task';

// Template kategorileri
export type TemplateCategory =
    | 'personal'    // Kişisel
    | 'work'        // İş
    | 'education'   // Eğitim
    | 'health'      // Sağlık
    | 'creative';   // Yaratıcı

// Görüntüleme formatı
export type TemplateFormat = 'list';

// Şablondaki her bir görev
export interface TemplateTask {
    title: string;
    description?: string;
    priority: TaskPriority;
}

// Şablondaki adım (stage)
export interface TemplateStage {
    id: string;
    title: string;        // "Adım 1 - Problemi tanımla"
    icon: string;         // emoji
    tasks: TemplateTask[];
}

// Ana şablon tipi
export interface Template {
    id: string;
    title: string;           // "Proje Takibi"
    description: string;     // Hakkında tab içeriği
    category: TemplateCategory;
    format: TemplateFormat;
    icon: string;            // emoji veya lucide icon
    color: string;           // accent color hex
    stages: TemplateStage[]; // Adımlar
}

// Kategori renkleri
export const templateCategoryColors: Record<TemplateCategory, string> = {
    personal: '#8b5cf6',  // violet
    work: '#3b82f6',      // blue
    education: '#f59e0b', // amber
    health: '#22c55e',    // green
    creative: '#ec4899',  // pink
};

// Kategori ikonları
export const templateCategoryIcons: Record<TemplateCategory, string> = {
    personal: 'user',
    work: 'briefcase',
    education: 'book-open',
    health: 'heart',
    creative: 'palette',
};

// Kategori etiketleri
export const templateCategoryLabels: Record<TemplateCategory, string> = {
    personal: 'Kişisel',
    work: 'İş',
    education: 'Eğitim',
    health: 'Sağlık',
    creative: 'Yaratıcı',
};

// Format etiketleri
export const templateFormatLabels: Record<TemplateFormat, string> = {
    list: 'Liste',
};
