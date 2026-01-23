# Sentry Entegrasyonu Teknik Dokümantasyonu

Bu belge, AI-Do mobil uygulamasında gerçekleştirilen Sentry entegrasyonlarını, özelliklerini ve ilgili kod örneklerini içerir.

## 1. React Hata Sınırı (Error Boundary)

React bileşenlerinin render edilmesi sırasında oluşan hataların (beyaz ekran) yakalanması ve raporlanması sağlanmıştır.

**Dosya:** `components/shared/ErrorBoundary.tsx`

```typescript
// Sentry servisi import edilir
import { sentryService } from '../../src/core/infrastructure/monitoring/sentryService';

// ...

componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // React render hatası Sentry'e gönderilir
    // componentStack hatanın hangi bileşen ağacında olduğunu gösterir
    sentryService.captureException(error, { componentStack: errorInfo.componentStack });

    this.props.onError?.(error, errorInfo);
}
```

## 2. API Hata ve İstek Takibi

Axios Interceptor'ları kullanılarak yapılan tüm HTTP istekleri ve oluşan hatalar otomatik olarak takip edilir.

**Dosya:** `src/core/infrastructure/api/apiClient.ts`

### İstek Takibi (Breadcrumbs)
Her istek yapıldığında, hata oluşması durumunda bağlam sağlamak amacıyla bir "ekmek kırıntısı" (breadcrumb) bırakılır.

```typescript
apiClient.interceptors.request.use(async (requestConfig) => {
    // ...
    // İsteği Sentry'e breadcrumb olarak ekle
    sentryService.addBreadcrumb({
        category: 'api',
        message: `[${requestConfig.method?.toUpperCase()}] ${requestConfig.url}`,
        data: {
            url: requestConfig.url,
            method: requestConfig.method,
        },
        level: 'info'
    });
    // ...
});
```

### Hata Yakalama (Exception Capture)
400, 401, 404, 500 gibi HTTP hataları ve ağ bağlantı sorunları istisna (exception) olarak detaylı verilerle birlikte raporlanır.

```typescript
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // Yanıt varsa (Sunucu hatası: 4xx, 5xx)
        if (error.response) {
            sentryService.captureException(error, {
                status: error.response.status,
                url: error.config?.url,
                method: error.config?.method,
                data: error.response.data, // Sunucudan dönen hata mesajı
            });
        } 
        // İstek yapıldı ama yanıt yok (Ağ hatası)
        else if (error.request) {
            sentryService.captureException(error, {
                context: 'NoResponse',
                url: error.config?.url
            });
        }
        
        // ... (Token yenileme mantığı)
    }
);
```

## 3. Durum (State) Takibi ve Maskeleme

Kullanıcının uygulama içindeki durum değişikliklerini (Giriş, Veri güncelleme vb.) takip etmek için özel bir Zustand middleware'i geliştirilmiştir. Hassas veriler otomatik olarak maskelenir.

**Dosya:** `src/core/infrastructure/monitoring/sentryMiddleware.ts`

```typescript
const sentryMiddlewareImpl = (f, name, options) => (set, get, store) => {
  const loggedSet = (...a) => {
    set(...a);
    const state = get();
    
    // Hassas verileri filtrele veya maskele
    // ...
    
    // Durum değişikliğini breadcrumb olarak ekle
    sentryService.addBreadcrumb({
      category: 'state',
      message: `State Update: ${name || 'Unknown Store'}`,
      data: safeState, // Maskelenmiş güvenli veri
      level: 'info'
    });
  };
  store.setState = loggedSet;
  return f(loggedSet, get, store);
};
```

**Kullanım Örneği (`useAuthStore.ts`):**

```typescript
export const useAuthStore = create<AuthState>()(
    sentryMiddleware(
        (set, get) => ({
            // ... store implementation
        }), 
        'AuthStore', // Store adı (Sentry'de görünür)
        {
            mask: ['token'] // 'token' alanı otomatik olarak ***MASKED*** yapılır
        }
    )
);
```

## 4. Sürüm ve Release Takibi

Hataların hangi versiyonda çözüldüğünü veya başladığını takip etmek için `expo-application` kullanılarak tam sürüm bilgisi gönderilir.

**Dosya:** `src/core/infrastructure/monitoring/sentryService.ts`

```typescript
import * as Application from 'expo-application';

// ...

const release = Application.nativeApplicationVersion 
    ? `${Application.applicationId}@${Application.nativeApplicationVersion}+${Application.nativeBuildVersion}`
    : undefined;

// Örn: com.aido.mobile@1.0.0+1
Sentry.init({
    // ...
    release: release,
    dist: Application.nativeBuildVersion,
});
```

## 5. Performans İzleme Yardımcısı

Kritik asenkron işlemlerin süresini ölçmek için `traceAsync` yardımcısı eklenmiştir.

**Dosya:** `src/core/infrastructure/monitoring/sentryService.ts`

```typescript
async traceAsync<T>(
    name: string, 
    op: string, 
    task: () => Promise<T>,
    data?: Record<string, unknown>
): Promise<T> {
    // İşlemi bir "Span" içinde çalıştırır ve süresini ölçer
    return Sentry.startSpan({ name, op, attributes: data }, async () => {
        return await task();
    });
}
```
