# 🚀 AI-Do Mobile

AI destekli akıllı görev yönetimi mobil uygulaması. Clean Architecture prensiplerine uygun, modern React Native/Expo ile geliştirilmiştir.

![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue)
![Expo](https://img.shields.io/badge/Expo-52.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Mimari Yapı](#-mimari-yapı)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Design Patterns](#-design-patterns)
- [Geliştirme Yol Haritası](#-geliştirme-yol-haritası)

---

## 📖 Proje Hakkında

**AI-Do** akıllı görev yönetimi, pomodoro zamanlayıcı ve analitik özellikleri bir arada sunan modern bir mobil uygulamadır. Yapay zeka destekli öneriler ile kullanıcıların verimliliğini artırmayı hedefler.

### Hedef Kitle
- Öğrenciler
- Profesyoneller
- Verimlilik odaklı bireyler

---

## ✨ Özellikler

### 📝 Görev Yönetimi
- Görev oluşturma, düzenleme, silme
- Alt görevler (subtasks)
- Kategoriler (İş, Kişisel, Sağlık, Eğitim, vb.)
- Öncelik seviyeleri (Düşük, Orta, Yüksek, Acil)
- Takvim entegrasyonu

### ⏱️ Pomodoro Timer
- Özelleştirilebilir preset'ler
- Stopwatch modu
- Oturum istatistikleri
- Haftalık trend analizi

### 📊 Analitik
- Günlük, haftalık trend analizleri
- Kategori bazlı performans grafikleri
- Toplam odaklanma süresi
- Tamamlanan görev oranları

### 🤖 AI Önerileri
- Enerji seviyesine göre görev önerileri
- Mola zamanları hatırlatmaları
- Akıllı zamanlama önerileri

### 🎨 Tema Desteği
- Açık/Koyu tema
- Sistem temasına uyum

---

## 🛠️ Teknolojiler

### Core Framework
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| React Native | 0.76.5 | Cross-platform mobil geliştirme |
| Expo | 52.0.0 | React Native toolchain |
| TypeScript | 5.3 | Tip güvenliği |

### Navigation & Routing
| Paket | Açıklama |
|-------|----------|
| expo-router | File-based routing |
| react-native-screens | Native navigation |
| react-native-safe-area-context | Safe area handling |

### State Management
| Paket | Açıklama |
|-------|----------|
| Zustand | Lightweight state management |

### Storage
| Paket | Açıklama |
|-------|----------|
| @react-native-async-storage/async-storage | Genel veri depolama |
| expo-secure-store | Güvenli token storage |

### UI & Animations
| Paket | Açıklama |
|-------|----------|
| react-native-reanimated | Performanslı animasyonlar |
| react-native-gesture-handler | Gesture handling |
| expo-linear-gradient | Gradient backgrounds |
| lucide-react-native | Modern ikonlar |
| react-native-svg | SVG rendering |

### Utilities
| Paket | Açıklama |
|-------|----------|
| expo-notifications | Push notifications |
| expo-linking | Deep linking |
| expo-constants | Environment constants |

---

## 🏗️ Mimari Yapı

Proje **Feature-Based Clean Architecture** prensiplerine göre yapılandırılmıştır.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Screens   │  │ Components  │  │   Stores    │          │
│  │  (app/)     │  │(components/)│  │  (Zustand)  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                    DOMAIN LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Entities   │  │  Use Cases  │  │ Interfaces  │          │
│  │   (Task,    │  │  (Create,   │  │(IRepository)│          │
│  │   User)     │  │   Update)   │  │             │          │
│  └─────────────┘  └──────┬──────┘  └──────┬──────┘          │
└──────────────────────────┼────────────────┼─────────────────┘
                           │                │
┌──────────────────────────┼────────────────┼─────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│  ┌─────────────────────────────────────────────────┐        │
│  │              Repository Implementations          │        │
│  │    (TaskRepository, AuthRepository, etc.)       │        │
│  └──────────────────────┬──────────────────────────┘        │
│                         │                                    │
│  ┌─────────────────────────────────────────────────┐        │
│  │             Storage Adapters                     │        │
│  │    (AsyncStorage, SecureStorage)                │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Proje Yapısı

```
ai-do-mobile/
├── 📂 app/                          # Expo Router Screens
│   ├── 📂 (auth)/                   # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── onboarding.tsx
│   │   └── _layout.tsx
│   ├── 📂 (tabs)/                   # Tab navigation
│   │   ├── index.tsx                # Home
│   │   ├── tasks.tsx                # Görevler
│   │   ├── calendar.tsx             # Takvim
│   │   ├── pomo.tsx                 # Pomodoro
│   │   ├── analytics.tsx            # Analitik
│   │   ├── profile.tsx              # Profil
│   │   └── _layout.tsx
│   ├── 📂 task/                     # Task modals
│   │   ├── [id].tsx                 # Task detay
│   │   └── create.tsx               # Yeni görev
│   └── _layout.tsx                  # Root layout
│
├── 📂 src/                          # Clean Architecture
│   ├── 📂 core/                     # Shared infrastructure
│   │   ├── 📂 domain/
│   │   │   ├── 📂 entities/
│   │   │   │   └── BaseEntity.ts    # Base entity class
│   │   │   └── 📂 value-objects/
│   │   │       ├── Result.ts        # Result pattern
│   │   │       └── UniqueId.ts      # ID generator
│   │   └── 📂 infrastructure/
│   │       └── 📂 storage/
│   │           ├── IStorageAdapter.ts
│   │           ├── AsyncStorageAdapter.ts
│   │           └── SecureStorageAdapter.ts
│   │
│   ├── 📂 features/                 # Feature modules
│   │   ├── 📂 task/
│   │   │   ├── 📂 domain/
│   │   │   │   ├── 📂 entities/
│   │   │   │   │   └── Task.ts      # Task entity + business logic
│   │   │   │   ├── 📂 repositories/
│   │   │   │   │   └── ITaskRepository.ts
│   │   │   │   └── 📂 usecases/
│   │   │   │       ├── CreateTask.ts
│   │   │   │       ├── UpdateTask.ts
│   │   │   │       ├── DeleteTask.ts
│   │   │   │       └── GetTasks.ts
│   │   │   ├── 📂 infrastructure/
│   │   │   │   └── 📂 repositories/
│   │   │   │       └── TaskRepository.ts
│   │   │   └── 📂 presentation/
│   │   │       └── 📂 stores/
│   │   │           └── useTaskStore.ts
│   │   │
│   │   ├── 📂 auth/                 # Auth feature (same structure)
│   │   └── 📂 pomo/                 # Pomo feature (same structure)
│   │
│   └── 📂 shared/
│       ├── 📂 utils/                # Utility functions
│       ├── 📂 constants/            # App constants
│       └── 📂 hooks/                # Custom React hooks
│
├── 📂 components/                   # UI Components
│   ├── 📂 ui/                       # Generic UI (Button, Card, Input)
│   ├── 📂 task/                     # Task specific
│   ├── 📂 pomo/                     # Pomo specific
│   ├── 📂 analytics/                # Analytics charts
│   ├── 📂 ai/                       # AI suggestion cards
│   └── 📂 shared/                   # ThemeProvider
│
├── 📂 store/                        # Zustand stores (re-exports)
├── 📂 types/                        # TypeScript types (re-exports)
├── 📂 constants/                    # Theme colors
└── 📂 assets/                       # Static assets
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator (macOS) veya Android Emulator

### Adımlar

```bash
# Projeyi klonla
git clone <repository-url>
cd ai-do-mobile

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Platform seçenekleri
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

---

## 💻 Kullanım

### Store Kullanımı

```typescript
import { useTaskStore } from '@/store/taskStore';

function MyComponent() {
    const { tasks, createTask, toggleComplete } = useTaskStore();
    
    const handleCreate = async () => {
        await createTask({
            title: 'Yeni Görev',
            priority: 'high',
            category: 'work',
        });
    };
    
    return (/* ... */);
}
```

### Entity Kullanımı

```typescript
import { Task } from '@/src/features/task/domain';

// Factory ile oluştur
const task = Task.create({
    title: 'Toplantı',
    priority: 'high',
});

// Business logic
task.complete();
task.addSubtask('Notları hazırla');
console.log(task.isOverdue); // computed property
```

---

## 🎨 Design Patterns

### 1. Repository Pattern
Veri erişimini soyutlar, storage değişikliği kolaylaşır.
```typescript
interface ITaskRepository {
    getAll(): Promise<Result<Task[], Error>>;
    save(task: Task): Promise<Result<void, Error>>;
}
```

### 2. Use Case Pattern
İş mantığını kapsüller, tek sorumluluk prensibi.
```typescript
class CreateTaskUseCase {
    constructor(private repository: ITaskRepository) {}
    
    async execute(dto: CreateTaskDTO): Promise<Result<Task, Error>> {
        // validation + business logic
    }
}
```

### 3. Result Pattern
Fonksiyonel hata yönetimi.
```typescript
const result = await createTask.execute(data);
if (result.isSuccess) {
    console.log(result.value);
} else {
    console.error(result.error);
}
```

### 4. Factory Pattern
Entity oluşturma standardize edilir.
```typescript
const task = Task.create({ title: 'Test' }); // Factory
const task2 = Task.fromJSON(props);          // Hydration
```

### 5. Adapter Pattern
Storage soyutlaması.
```typescript
interface IStorageAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
}
```

---

## 🗺️ Geliştirme Yol Haritası

### ✅ Tamamlanan (v1.0)
- [x] Ana ekranlar (Home, Tasks, Calendar, Pomo, Analytics, Profile)
- [x] Görev CRUD işlemleri
- [x] Pomodoro timer
- [x] Temel analitik
- [x] Tema desteği (Light/Dark)
- [x] Clean Architecture yapısı
- [x] Repository pattern implementasyonu

### 🔄 Devam Eden (v1.1)
- [ ] Backend API entegrasyonu
- [ ] Gerçek authentication (OAuth/JWT)
- [ ] Push notifications
- [ ] Offline sync

### 📋 Planlanan (v1.2+)
- [ ] AI-powered task suggestions (OpenAI/Gemini)
- [ ] Widget desteği (iOS/Android)
- [ ] Apple Watch / WearOS desteği
- [ ] Takvim sync (Google Calendar, Apple Calendar)
- [ ] Takım/paylaşım özellikleri
- [ ] Gamification (rozetler, streak'ler)
- [ ] Sesli görev ekleme
- [ ] Recurring tasks (tekrarlayan görevler)
- [ ] Cloud backup
- [ ] Multi-language support

### 🧪 Teknik İyileştirmeler
- [ ] Unit testler (Jest)
- [ ] E2E testler (Detox)
- [ ] CI/CD pipeline
- [ ] Error tracking (Sentry)
- [ ] Analytics (Firebase/Amplitude)
- [ ] Performance monitoring

---

## 📄 Lisans

Bu proje özel lisans altındadır. Tüm hakları saklıdır.

---

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

<p align="center">
  Made with ❤️ using React Native & Expo
</p>
