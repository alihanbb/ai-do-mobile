# 🔐 Auth Yapısı Akış Diyagramı

Bu belge, AI-Do Mobile uygulamasının kimlik doğrulama (authentication) yapısını açıklar.

## Mimari Genel Bakış

```mermaid
flowchart TB
    subgraph UI["📱 Presentation Layer"]
        LS[LoginScreen]
        RS[RegisterScreen]
        AS[useAuthStore<br/>Zustand Store]
    end

    subgraph Domain["🎯 Domain Layer"]
        LUC[LoginUseCase]
        RUC[RegisterUseCase]
        LOUC[LogoutUseCase]
        IAR[IAuthRepository<br/>Interface]
        UE[User Entity]
    end

    subgraph Infra["⚙️ Infrastructure Layer"]
        AR[AuthRepository]
        IA[IdentityApi]
        AC[ApiClient<br/>Axios]
        SS[SecureStorage<br/>LocalStorage]
    end

    subgraph Backend["☁️ Backend API"]
        BE["/auth/login<br/>/auth/register<br/>/auth/refresh-token"]
    end

    LS --> |"login(email, pwd)"| AS
    RS --> |"register(name, email, pwd)"| AS
    
    AS --> |"execute()"| LUC
    AS --> |"execute()"| RUC
    AS --> |"execute()"| LOUC
    
    LUC --> |"login()"| IAR
    RUC --> |"register()"| IAR
    LOUC --> |"logout()"| IAR
    
    IAR -.-> |"implements"| AR
    AR --> |"login/register"| IA
    AR --> |"save/get tokens"| SS
    
    IA --> |"HTTP POST"| AC
    AC --> |"Bearer Token"| BE
    
    BE --> |"AuthResponseDto"| AC
    AC --> |"response"| IA
    IA --> |"IdentityApiResult"| AR
    AR --> |"Result<User, Tokens>"| LUC
    LUC --> |"Result"| AS
    AS --> |"setState"| LS
    
    style UI fill:#e1f5fe
    style Domain fill:#fff3e0
    style Infra fill:#e8f5e9
    style Backend fill:#fce4ec
```

---

## Login Akışı (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant LS as LoginScreen
    participant AS as useAuthStore
    participant LUC as LoginUseCase
    participant AR as AuthRepository
    participant IA as IdentityApi
    participant AC as ApiClient
    participant SS as SecureStorage
    participant BE as 🌐 Backend

    U->>LS: Email & Password girer
    LS->>AS: login(email, password)
    AS->>AS: set({ isLoading: true })
    AS->>LUC: execute({ email, password })
    
    LUC->>LUC: Validate credentials
    LUC->>AR: login(credentials)
    AR->>IA: login({ email, password })
    IA->>AC: POST /auth/login
    
    AC->>BE: HTTP Request
    BE-->>AC: AuthResponseDto
    AC-->>IA: AxiosResponse
    IA-->>AR: IdentityApiResult<AuthResponseDto>
    
    AR->>AR: mapResponseToUser()
    AR->>SS: saveTokens(accessToken, refreshToken)
    AR->>SS: set(USER_DATA_KEY, user)
    AR-->>LUC: Result.ok({ user, tokens })
    
    LUC-->>AS: Result<{ user, tokens }>
    AS->>AS: set({ user, token, isAuthenticated: true })
    AS-->>LS: return true
    LS->>U: Navigate to Home
```

---

## Token Refresh Akışı

```mermaid
flowchart LR
    subgraph Request["API İsteği"]
        R1[Request with Token]
    end
    
    subgraph Interceptor["Axios Interceptor"]
        I1{401 Error?}
        I2[Get RefreshToken]
        I3[POST /auth/refresh-token]
        I4[Save New Tokens]
        I5[Retry Original Request]
    end
    
    subgraph Fail["Hata Durumu"]
        F1[Clear Tokens]
        F2[Logout User]
    end
    
    R1 --> I1
    I1 -->|Yes| I2
    I1 -->|No| R1
    I2 --> I3
    I3 -->|Success| I4
    I4 --> I5
    I3 -->|Fail| F1
    F1 --> F2
```

---

## Dosya Yapısı

| Katman | Dosya | Sorumluluk |
|--------|-------|------------|
| **Presentation** | [useAuthStore.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/presentation/stores/useAuthStore.ts) | UI state yönetimi (Zustand) |
| **Domain** | [Login.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/domain/usecases/Login.ts) | Login use case |
| **Domain** | [Register.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/domain/usecases/Register.ts) | Register use case |
| **Domain** | [Logout.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/domain/usecases/Logout.ts) | Logout use case |
| **Domain** | [IAuthRepository.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/domain/repositories/IAuthRepository.ts) | Repository interface |
| **Domain** | [User.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/domain/entities/User.ts) | User entity & value objects |
| **Infrastructure** | [AuthRepository.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/infrastructure/repositories/AuthRepository.ts) | Repository implementasyonu |
| **Infrastructure** | [identityApi.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/features/auth/infrastructure/api/identityApi.ts) | Backend API çağrıları |
| **Infrastructure** | [apiClient.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/core/infrastructure/api/apiClient.ts) | Axios instance + interceptors |
| **Infrastructure** | [SecureStorageAdapter.ts](file:///c:/Users/ACER/Desktop/Projeler/ai-do-mobile/src/core/infrastructure/storage/SecureStorageAdapter.ts) | Token saklama |

---

## Önemli Noktalar

### Clean Architecture
- **Domain katmanı** dış bağımlılıklardan tamamen izole
- **Dependency Inversion** prensibi: Repository interface üzerinden çalışıyor
- **Use Cases** iş mantığını kapsüller

### Güvenlik
- **JWT Token** tabanlı kimlik doğrulama
- **Secure Storage** kullanımı (mobile: expo-secure-store, web: localStorage)
- **Auto Token Refresh**: 401 hatası alındığında otomatik token yenileme

### Hata Yönetimi
- **Result Pattern**: `Result<T, Error>` ile fonksiyonel hata yönetimi
- **API Error Parsing**: Axios hataları için ayrıştırma mekanizması

---

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/login` | Kullanıcı girişi |
| POST | `/auth/register` | Yeni kullanıcı kaydı |
| POST | `/auth/refresh-token` | Token yenileme |
| GET | `/auth/me` | Mevcut kullanıcı bilgisi |

---

## DTO Yapıları

### AuthResponseDto (Backend'den gelen)
```typescript
interface AuthResponseDto {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
```

### LoginRequest (Backend'e gönderilen)
```typescript
interface LoginRequest {
    email: string;
    password: string;
}
```

### RegisterRequest (Backend'e gönderilen)
```typescript
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}
```
