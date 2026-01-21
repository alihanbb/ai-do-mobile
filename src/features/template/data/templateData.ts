import { Template, TemplateCategory } from '../domain/entities/Template';

// Tüm şablonları içeren statik veri
export const TEMPLATES: Template[] = [
    // ===== KİŞİSEL =====
    {
        id: 'morning-routine',
        title: 'Sabah Rutini',
        description: 'Güne enerjik ve organize başlamak için sabah rutini şablonu. Sağlıklı alışkanlıklar geliştirmenize yardımcı olur.',
        category: 'personal',
        format: 'list',
        icon: '🌅',
        color: '#8b5cf6',
        stages: [
            {
                id: 'wake-up',
                title: 'Adım 1 - Uyanış',
                icon: '☀️',
                tasks: [
                    { title: 'Alarmı kapat ve esne', priority: 'medium' },
                    { title: 'Bir bardak su iç', priority: 'high' },
                    { title: '5 dakika meditasyon', description: 'Derin nefes al ve günü planla', priority: 'medium' },
                ],
            },
            {
                id: 'preparation',
                title: 'Adım 2 - Hazırlık',
                icon: '🚿',
                tasks: [
                    { title: 'Duş al', priority: 'high' },
                    { title: 'Kıyafetlerini hazırla', priority: 'medium' },
                    { title: 'Sağlıklı kahvaltı hazırla', priority: 'high' },
                    { title: 'Kahvaltı yap', priority: 'high' },
                ],
            },
            {
                id: 'planning',
                title: 'Adım 3 - Planlama',
                icon: '📝',
                tasks: [
                    { title: 'Günün görevlerini listele', priority: 'high' },
                    { title: 'Öncelikleri belirle', priority: 'high' },
                    { title: 'Takvimi kontrol et', priority: 'medium' },
                ],
            },
        ],
    },
    {
        id: 'daily-planning',
        title: 'Günlük Planlama',
        description: 'Her gün verimli geçirmek için günlük planlama şablonu. Hedeflerinize odaklanmanıza yardımcı olur.',
        category: 'personal',
        format: 'list',
        icon: '📋',
        color: '#8b5cf6',
        stages: [
            {
                id: 'review',
                title: 'Adım 1 - Gözden Geçir',
                icon: '👀',
                tasks: [
                    { title: 'Dünün görevlerini kontrol et', priority: 'medium' },
                    { title: 'Tamamlanmayan görevleri aktar', priority: 'high' },
                    { title: 'E-postaları kontrol et', priority: 'medium' },
                ],
            },
            {
                id: 'prioritize',
                title: 'Adım 2 - Önceliklendir',
                icon: '🎯',
                tasks: [
                    { title: 'En önemli 3 görevi belirle', priority: 'urgent' },
                    { title: 'Zaman blokları oluştur', priority: 'high' },
                    { title: 'Toplantıları planla', priority: 'medium' },
                ],
            },
        ],
    },

    // ===== İŞ =====
    {
        id: 'project-management',
        title: 'Proje Yönetimi',
        description: 'Yeni bir projeyi başından sonuna kadar yönetmek için kapsamlı şablon. Ekip çalışması ve bireysel projeler için uygundur.',
        category: 'work',
        format: 'list',
        icon: '📊',
        color: '#3b82f6',
        stages: [
            {
                id: 'define',
                title: 'Adım 1 - Problemi Tanımla',
                icon: '🎯',
                tasks: [
                    { title: 'Problemi analiz et', description: 'Mevcut durumu değerlendir', priority: 'high' },
                    { title: 'Çözümleri araştır', priority: 'high' },
                    { title: 'Fikir danış', description: 'Profesyonel çevrene veya mentörlere danış', priority: 'medium' },
                    { title: 'Hangi metodu kullanacağına karar ver', priority: 'high' },
                ],
            },
            {
                id: 'prepare',
                title: 'Adım 2 - Hazırlık',
                icon: '📋',
                tasks: [
                    { title: 'Fikrin için en etkili uygulamaları araştır', priority: 'medium' },
                    { title: 'Proje özelliklerini yaz', description: 'Somut eylem maddelerini belirle', priority: 'high' },
                    { title: 'Planın hakkında ekibinden geri bildirim al', priority: 'medium' },
                    { title: 'Gelen geri bildirimlere göre planını düzenle', priority: 'medium' },
                    { title: 'Planını sonlandır', priority: 'high' },
                ],
            },
            {
                id: 'execute',
                title: 'Adım 3 - Uygulama',
                icon: '🔨',
                tasks: [
                    { title: 'Görevleri ekibe dağıt', priority: 'high' },
                    { title: 'İlerlemeyi takip et', priority: 'high' },
                    { title: 'Düzenli toplantılar yap', priority: 'medium' },
                    { title: 'Engelleri çöz', priority: 'urgent' },
                    { title: 'Dokümantasyon yap', priority: 'medium' },
                ],
            },
            {
                id: 'complete',
                title: 'Adım 4 - Tamamlama',
                icon: '✅',
                tasks: [
                    { title: 'Son kontrolleri yap', priority: 'high' },
                    { title: 'Projeyi teslim et', priority: 'urgent' },
                    { title: 'Retrospektif toplantısı yap', priority: 'medium' },
                ],
            },
        ],
    },
    {
        id: 'sprint-tracking',
        title: 'Sprint Takibi',
        description: 'Agile/Scrum metodolojisi ile sprint yönetimi. 2 haftalık sprint döngüsü için idealdir.',
        category: 'work',
        format: 'list',
        icon: '🏃',
        color: '#3b82f6',
        stages: [
            {
                id: 'backlog',
                title: 'Backlog',
                icon: '📥',
                tasks: [
                    { title: 'User story yazımı', priority: 'high' },
                    { title: 'Önceliklendirme', priority: 'high' },
                    { title: 'Tahminleme (estimation)', priority: 'medium' },
                ],
            },
            {
                id: 'in-progress',
                title: 'Devam Eden',
                icon: '🔄',
                tasks: [
                    { title: 'Günlük standup', priority: 'high' },
                    { title: 'Task geliştirme', priority: 'high' },
                    { title: 'Code review', priority: 'high' },
                ],
            },
            {
                id: 'review',
                title: 'İnceleme',
                icon: '👁️',
                tasks: [
                    { title: 'QA testi', priority: 'high' },
                    { title: 'Demo hazırlığı', priority: 'medium' },
                ],
            },
            {
                id: 'done',
                title: 'Tamamlandı',
                icon: '✅',
                tasks: [
                    { title: 'Sprint review', priority: 'medium' },
                    { title: 'Retrospektif', priority: 'medium' },
                ],
            },
        ],
    },

    // ===== EĞİTİM =====
    {
        id: 'exam-preparation',
        title: 'Sınav Hazırlığı',
        description: 'Sınava sistematik hazırlanmak için adım adım çalışma planı. Her türlü sınav için uygundur.',
        category: 'education',
        format: 'list',
        icon: '📚',
        color: '#f59e0b',
        stages: [
            {
                id: 'identify',
                title: 'Adım 1 - Konuları Belirle',
                icon: '📋',
                tasks: [
                    { title: 'Müfredat konularını listele', priority: 'high' },
                    { title: 'Zayıf konuları işaretle', priority: 'high' },
                    { title: 'Çalışma takvimi oluştur', priority: 'high' },
                ],
            },
            {
                id: 'study',
                title: 'Adım 2 - Çalışma',
                icon: '📖',
                tasks: [
                    { title: 'Ders notlarını çıkar', priority: 'high' },
                    { title: 'Kaynak kitapları oku', priority: 'high' },
                    { title: 'Özet kartları hazırla', priority: 'medium' },
                    { title: 'Video dersleri izle', priority: 'medium' },
                    { title: 'Anlamadığın konuları not al', priority: 'high' },
                ],
            },
            {
                id: 'practice',
                title: 'Adım 3 - Pratik',
                icon: '✍️',
                tasks: [
                    { title: 'Çıkmış soruları çöz', priority: 'urgent' },
                    { title: 'Deneme sınavı yap', priority: 'high' },
                    { title: 'Hataları analiz et', priority: 'high' },
                    { title: 'Zayıf konuları tekrar et', priority: 'high' },
                ],
            },
            {
                id: 'final-review',
                title: 'Adım 4 - Son Tekrar',
                icon: '🎯',
                tasks: [
                    { title: 'Özet kartlarını gözden geçir', priority: 'high' },
                    { title: 'Formülleri ezberle', priority: 'high' },
                    { title: 'Erken yat, dinlen', priority: 'urgent' },
                ],
            },
        ],
    },

    // ===== SAĞLIK =====
    {
        id: 'weekly-workout',
        title: 'Haftalık Egzersiz',
        description: 'Dengeli bir haftalık egzersiz programı. Kardiyo, güç antrenmanı ve esneklik çalışmalarını içerir.',
        category: 'health',
        format: 'list',
        icon: '💪',
        color: '#22c55e',
        stages: [
            {
                id: 'monday',
                title: 'Pazartesi - Kardiyo',
                icon: '🏃',
                tasks: [
                    { title: '10 dk ısınma', priority: 'high' },
                    { title: '30 dk koşu veya bisiklet', priority: 'high' },
                    { title: '10 dk soğuma', priority: 'medium' },
                ],
            },
            {
                id: 'wednesday',
                title: 'Çarşamba - Güç',
                icon: '🏋️',
                tasks: [
                    { title: 'Isınma hareketleri', priority: 'high' },
                    { title: 'Üst vücut antrenmanı', priority: 'high' },
                    { title: 'Core egzersizleri', priority: 'high' },
                    { title: 'Esneme', priority: 'medium' },
                ],
            },
            {
                id: 'friday',
                title: 'Cuma - Yoga/Esneklik',
                icon: '🧘',
                tasks: [
                    { title: '45 dk yoga seansı', priority: 'high' },
                    { title: 'Derin nefes egzersizleri', priority: 'medium' },
                    { title: 'Meditasyon', priority: 'medium' },
                ],
            },
        ],
    },

    // ===== YARATICI =====
    {
        id: 'blog-post',
        title: 'Blog Yazısı',
        description: 'Blog yazısı oluşturma süreci. Fikir aşamasından yayına kadar tüm adımları içerir.',
        category: 'creative',
        format: 'list',
        icon: '✍️',
        color: '#ec4899',
        stages: [
            {
                id: 'idea',
                title: 'Adım 1 - Fikir',
                icon: '💡',
                tasks: [
                    { title: 'Konu brainstorming', priority: 'high' },
                    { title: 'Anahtar kelime araştırması', priority: 'high' },
                    { title: 'Başlık seçenekleri yaz', priority: 'medium' },
                ],
            },
            {
                id: 'research',
                title: 'Adım 2 - Araştırma',
                icon: '🔍',
                tasks: [
                    { title: 'Rakip içerikleri incele', priority: 'medium' },
                    { title: 'Kaynak topla', priority: 'high' },
                    { title: 'Taslak oluştur', priority: 'high' },
                    { title: 'Ana noktaları belirle', priority: 'high' },
                ],
            },
            {
                id: 'writing',
                title: 'Adım 3 - Yazım',
                icon: '📝',
                tasks: [
                    { title: 'Giriş paragrafı yaz', priority: 'high' },
                    { title: 'Ana bölümü yaz', priority: 'high' },
                    { title: 'Sonuç paragrafı yaz', priority: 'high' },
                ],
            },
            {
                id: 'publish',
                title: 'Adım 4 - Yayın',
                icon: '🚀',
                tasks: [
                    { title: 'Düzenleme ve editing', priority: 'high' },
                    { title: 'Görselleri ekle', priority: 'medium' },
                    { title: 'SEO optimizasyonu', priority: 'high' },
                    { title: 'Yayınla', priority: 'urgent' },
                ],
            },
        ],
    },
    {
        id: 'video-production',
        title: 'Video Üretimi',
        description: 'YouTube veya sosyal medya için video üretim süreci. Senaryo yazımından yayına kadar.',
        category: 'creative',
        format: 'list',
        icon: '🎬',
        color: '#ec4899',
        stages: [
            {
                id: 'script',
                title: 'Adım 1 - Senaryo',
                icon: '📜',
                tasks: [
                    { title: 'Video konusunu belirle', priority: 'high' },
                    { title: 'Senaryoyu yaz', priority: 'high' },
                    { title: 'Storyboard oluştur', priority: 'medium' },
                ],
            },
            {
                id: 'shooting',
                title: 'Adım 2 - Çekim',
                icon: '📹',
                tasks: [
                    { title: 'Ekipmanları hazırla', priority: 'high' },
                    { title: 'Set düzeni kur', priority: 'medium' },
                    { title: 'Çekimi yap', priority: 'urgent' },
                    { title: 'B-roll çekimleri', priority: 'medium' },
                ],
            },
            {
                id: 'editing',
                title: 'Adım 3 - Kurgu',
                icon: '✂️',
                tasks: [
                    { title: 'Raw footage düzenle', priority: 'high' },
                    { title: 'Ses düzenleme', priority: 'high' },
                    { title: 'Efektler ve geçişler ekle', priority: 'medium' },
                    { title: 'Thumbnail oluştur', priority: 'high' },
                ],
            },
            {
                id: 'publish',
                title: 'Adım 4 - Yayın',
                icon: '📤',
                tasks: [
                    { title: 'Video başlığı ve açıklama yaz', priority: 'high' },
                    { title: 'Etiketleri ekle', priority: 'medium' },
                    { title: 'Yükle ve yayınla', priority: 'urgent' },
                ],
            },
        ],
    },
];

// Kategoriye göre şablonları getir
export const getTemplatesByCategory = (category: TemplateCategory | null): Template[] => {
    if (!category) return TEMPLATES;
    return TEMPLATES.filter(t => t.category === category);
};

// ID'ye göre şablon getir
export const getTemplateById = (id: string): Template | undefined => {
    return TEMPLATES.find(t => t.id === id);
};

// Tüm kategorileri getir (UI için)
export const TEMPLATE_CATEGORIES: { id: TemplateCategory | null; label: string }[] = [
    { id: null, label: 'Tümü' },
    { id: 'personal', label: 'Kişisel' },
    { id: 'work', label: 'İş' },
    { id: 'education', label: 'Eğitim' },
    { id: 'health', label: 'Sağlık' },
    { id: 'creative', label: 'Yaratıcı' },
];
