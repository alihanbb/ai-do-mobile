# AI-Do Mobil Uygulama Geliştirme Yol Haritası

> Piyasadaki rakiplerle kıyaslama ve faz bazlı geliştirme planı (Sadece Mobil)

##  Piyasa Analizi: Rakip Karşılaştırması

| Özellik | Todoist | Any.do | TickTick | Things | **AI-Do** |
|---------|---------|--------|----------|--------|-----------|
| AI Natural Language |  |  |  |  |  |
| Akıllı Zamanlama |  |  |  |  |  |
| Otomatik Önceliklendirme |  |  |  |  |  |
| **Enerji Analizi** |  |  |  |  |  |
| **Konum Tabanlı Öneriler** |  |  |  |  |  |
| **Multimodal Girdi** |  |  |  |  |  |
| **Otonom Görev Oluşturma** |  |  |  |  |  |

### AI-Do Rekabet Avantajları
1. **Enerji Bazlı Zamanlama** - benzersiz
2. **Multimodal Girdi** (ses/görsel) - benzersiz
3. **Bağlam Farkındalığı** (konum + zaman + enerji)

---

##  Geliştirme Fazları (Sadece Mobil)

### Faz 1: Temel Uygulama (3 Hafta)

#### Hafta 1: Altyapı
- [x] Expo Router konfigürasyonu
- [x] Auth ekranları (Login, Register)
- [x] Onboarding (3 slide)
- [x] Navigation yapısı
- [x] AsyncStorage token yönetimi

#### Hafta 2-3: Görev Yönetimi
- [x] Görev CRUD işlemleri
- [x] Görev listesi (filtreleme, arama)
- [x] Swipe to complete/delete
- [x] Kategori ve öncelik sistemi
- [x] Local notifications

**Çıktı**: Çalışan temel todo app

---

### Faz 2: Gelişmiş UI/UX (2 Hafta) ✅

#### Hafta 4-5: Polish
- [x] Takvim görünümü
- [x] Analitik dashboard
- [x] Profil ve ayarlar
- [x] Dark/Light tema
- [x] Animasyonlar ve geçişler
- [x] Empty states
- [x] Loading skeletons

**Çıktı**: Premium görünümlü uygulama ✅

---

### Faz 3: AI Core Özellikleri (3 Hafta)

#### Hafta 6-7: Natural Language
- [ ] OpenAI API entegrasyonu
- [ ] Doğal dil görev oluşturma
- [ ] Tarih/saat otomatik çıkarımı
- [ ] Kategori otomatik atama
- [ ] Öncelik tahmini

#### Hafta 8: Akıllı Öneriler
- [ ] AI öneri kartları
- [ ] Optimal zaman önerileri
- [ ] Görev parçalama
- [ ] Günlük planlama asistanı

**Çıktı**: AI destekli görev oluşturma

---

### Faz 4: Benzersiz Özellikler (3 Hafta)

#### Hafta 9-10: Enerji Analizi
- [ ] Günlük enerji seviyesi takibi
- [ ] Verimlilik pattern öğrenme
- [ ] Enerji bazlı görev önerileri
- [ ] "Yüksek enerji saati" bildirimleri
- [ ] Mola önerileri

#### Hafta 11: Bağlam Farkındalığı
- [ ] Konum tabanlı hatırlatıcılar
- [ ] Geofencing
- [ ] Ev/iş modu otomatik geçiş

**Çıktı**: Rakiplerden farklılaşma

---

### Faz 5: Multimodal Girdi (2 Hafta)

#### Hafta 12: Ses
- [ ] Expo Speech recognition
- [ ] Sesle görev ekleme
- [ ] Türkçe dil desteği

#### Hafta 13: Görsel
- [ ] Kamera entegrasyonu
- [ ] OCR ile metin çıkarma
- [ ] Fotoğraftan görev oluşturma

**Çıktı**: Ses ve görsel ile görev ekleme

---

### Faz 6: Widget ve Entegrasyonlar (2 Hafta)

#### Hafta 14-15: Platform Özellikleri
- [ ] iOS Widget
- [ ] Android Widget
- [ ] Apple Watch (opsiyonel)
- [ ] Shortcuts/Quick Actions
- [ ] Share extension

**Çıktı**: Native platform entegrasyonları

---

### Faz 7: Lansman Hazırlığı (2 Hafta)

#### Hafta 16: Optimizasyon
- [ ] Performance tuning
- [ ] Bundle size optimizasyonu
- [ ] Accessibility (a11y)
- [ ] Crash reporting (Sentry)

#### Hafta 17: Lansman
- [ ] App Store metadata
- [ ] Play Store listing
- [ ] Screenshots ve videolar
- [ ] Beta test programı
- [ ] Landing page güncellemesi

**Çıktı**: Yayınlanmaya hazır uygulama

---

##  Zaman Çizelgesi

```
Faz 1  Hafta 1-3
Faz 2  Hafta 4-5
Faz 3  Hafta 6-8
Faz 4  Hafta 9-11
Faz 5  Hafta 12-13
Faz 6  Hafta 14-15
Faz 7  Hafta 16-17
```

**Toplam Süre**: 17 hafta (~4 ay)

---

##  Teknik Stack (Mobil)

- **Framework**: React Native + Expo SDK 52
- **Routing**: Expo Router
- **State**: Zustand
- **Storage**: AsyncStorage / Expo SecureStore
- **AI**: OpenAI API (doğrudan mobil'den)
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Notifications**: Expo Notifications
- **Location**: Expo Location

---

> Not: Backend geliştirildiğinde, Faz 2 sonrasında API entegrasyonu eklenebilir.
