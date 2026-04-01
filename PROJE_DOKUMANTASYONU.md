# Enerji Tahmin Sistemi — Tam Proje Dokümantasyonu

Bu belge, projenin tüm katmanlarını (frontend, backend, veritabanı), dosya başına ne yapıldığını, birimlerin birbirleriyle nasıl iletişim kurduğunu ve örnek aksiyonlarda veri akışının nasıl gerçekleştiğini açıklar.

---

## İçindekiler

1. [Projeye Genel Bakış](#1-projeye-genel-bakış)
2. [Dizin Yapısı](#2-dizin-yapısı)
3. [Teknoloji Yığını](#3-teknoloji-yığını)
4. [Veritabanı Katmanı](#4-veritabanı-katmanı)
5. [Backend Katmanı](#5-backend-katmanı)
6. [Frontend Katmanı](#6-frontend-katmanı)
7. [Birimler Arası İletişim](#7-birimler-arası-iletişim)
8. [API Referansı](#8-api-referansı)
9. [Örnek Aksiyon Akışları](#9-örnek-aksiyon-akışları)
10. [Başlatma ve Kurulum](#10-başlatma-ve-kurulum)
11. [Test Hesapları](#11-test-hesapları)

---

## 1. Projeye Genel Bakış

Bu sistem, güneş enerji santrallarını (GES) ve hidroelektrik santrallarını (HES) yöneten bir **enerji üretim takip ve karar destek uygulamasıdır**.

**Temel işlevler:**
- Tahmin edilen ve gerçekleşen enerji üretimini karşılaştırma
- Sapma durumunda otomatik alarm üretme ve yönetme
- Tesis, bölge ve üst yönetici düzeyinde dashboardlar
- Excel formatında rapor dışa aktarma
- Rol tabanlı erişim denetimi (4 farklı kullanıcı rolü)

**Mimari özet:**

```
Kullanıcı Tarayıcısı
       │
       │  HTTP (JSON)
       ▼
  React Frontend  ──────────────►  Spring Boot Backend
  (localhost:5173)                 (localhost:8080)
                                          │
                                          │  JDBC
                                          ▼
                                    PostgreSQL DB
                                  (localhost:5432)
```

---

## 2. Dizin Yapısı

```
EnerjiTahminSistemiFrontend/
│
├── frontend/                              # React SPA
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── FacilitySelectionPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── operator/
│   │   │   │   ├── OperatorDashboardPage.jsx
│   │   │   │   ├── OperatorAlarmsPage.jsx
│   │   │   │   └── OperatorReportPage.jsx
│   │   │   ├── manager/
│   │   │   │   ├── ManagerDashboardPage.jsx
│   │   │   │   ├── ManagerAlarmsPage.jsx
│   │   │   │   └── ManagerReportPage.jsx
│   │   │   ├── regional/
│   │   │   │   ├── RegionalDashboardPage.jsx
│   │   │   │   ├── RegionalFacilitiesPage.jsx
│   │   │   │   ├── FacilityDetailPage.jsx
│   │   │   │   └── RegionalReportPage.jsx
│   │   │   └── executive/
│   │   │       ├── ExecutiveDashboardPage.jsx
│   │   │       ├── ExecutiveRegionsPage.jsx
│   │   │       ├── RegionDetailPage.jsx
│   │   │       └── ExecutiveReportPage.jsx
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProductionChart.jsx
│   │   │   └── IntroOverlay.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── DashboardLayout.css
│   │   │   ├── Sidebar.css
│   │   │   ├── LoginPage.css
│   │   │   ├── FacilitySelectionPage.css
│   │   │   ├── OperatorPages.css
│   │   │   └── ProfilePage.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/enerjitahmin/backend/
        │   ├── controller/
        │   │   ├── AuthController.java
        │   │   ├── UserController.java
        │   │   ├── FacilityController.java
        │   │   ├── AlarmController.java
        │   │   └── ProductionRecordController.java
        │   ├── entity/
        │   │   ├── User.java
        │   │   ├── Region.java
        │   │   ├── Facility.java
        │   │   ├── ProductionRecord.java
        │   │   └── Alarm.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   ├── RegionRepository.java
        │   │   ├── FacilityRepository.java
        │   │   ├── ProductionRecordRepository.java
        │   │   └── AlarmRepository.java
        │   ├── service/
        │   │   ├── AlarmGenerationService.java
        │   │   └── ProductionChartService.java
        │   ├── dto/
        │   │   └── ProductionChartPointDto.java
        │   ├── config/
        │   │   ├── CorsConfig.java
        │   │   └── DataInitializer.java
        │   ├── TestController.java
        │   └── BackendApplication.java
        └── resources/
            └── application.properties
```

---

## 3. Teknoloji Yığını

### Frontend

| Paket | Sürüm | Görev |
|-------|-------|-------|
| React | 19.2.4 | UI bileşen kütüphanesi |
| React Router DOM | 7.13.2 | Sayfa yönlendirme (SPA routing) |
| Recharts | 3.8.1 | Grafikler (alan + çizgi) |
| XLSX | 0.18.5 | Excel dosyası oluşturma |
| file-saver | 2.0.5 | Oluşturulan dosyayı tarayıcıdan indirme |
| Vite | 8.0.1 | Geliştirme sunucusu ve derleme aracı |

### Backend

| Teknoloji | Sürüm | Görev |
|-----------|-------|-------|
| Spring Boot | 4.0.4 | REST API framework |
| Spring Data JPA | — | ORM ile veritabanı erişimi |
| PostgreSQL Driver | — | Veritabanı bağlantısı |
| Java | 17 | Platform dili |
| Maven | — | Proje yönetimi ve bağımlılıklar |

### Veritabanı

| Teknoloji | Versiyon | Görev |
|-----------|----------|-------|
| PostgreSQL | — | İlişkisel veri depolama |
| Port | 5432 | Bağlantı noktası |
| DB adı | energy_forecast_db | Veritabanı adı |

---

## 4. Veritabanı Katmanı

### 4.1 Tablolar ve Sütunlar

#### `users` Tablosu
Sistemdeki tüm kullanıcıların bilgileri.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BIGINT (PK) | Otomatik artan birincil anahtar |
| first_name | VARCHAR | Ad |
| last_name | VARCHAR | Soyad |
| username | VARCHAR (unique) | Kullanıcı adı — giriş için kullanılır |
| password | VARCHAR | Şifre (düz metin) |
| email | VARCHAR | E-posta adresi |
| phone | VARCHAR | Telefon numarası |
| role | VARCHAR | Kullanıcı rolü (TESIS_GOREVLISI, TESIS_YONETICISI, BOLGE_YONETICISI, UST_YONETICI) |
| plant_type | VARCHAR | Tesis tipi (GES veya HES) |
| region_id | BIGINT (FK) | Bağlı olduğu bölge |
| facility_id | BIGINT (FK) | Bağlı olduğu tesis |
| active | BOOLEAN | Hesap aktiflik durumu |

#### `regions` Tablosu
Coğrafi bölgeler.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BIGINT (PK) | Birincil anahtar |
| name | VARCHAR | Bölge adı (örn. İç Anadolu) |
| plant_type | VARCHAR | Bölgedeki santral tipi (GES/HES) |

#### `facilities` Tablosu
Enerji santralleri.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BIGINT (PK) | Birincil anahtar |
| name | VARCHAR | Tesis adı (örn. GES Konya 1) |
| plant_type | VARCHAR | GES veya HES |
| region_id | BIGINT (FK) | Bağlı olduğu bölge |
| active | BOOLEAN | Tesisin aktiflik durumu |

#### `production_records` Tablosu
Günlük enerji üretim kayıtları.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BIGINT (PK) | Birincil anahtar |
| facility_id | BIGINT (FK) | Hangi tesise ait |
| record_date | DATE | Kayıt tarihi |
| predicted_energy | DOUBLE | Tahmin edilen üretim (kWh) |
| actual_energy | DOUBLE | Gerçekleşen üretim (kWh) |

#### `alarms` Tablosu
Üretim sapması alarmları.

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BIGINT (PK) | Birincil anahtar |
| facility_id | BIGINT (FK) | Alarmın üretildiği tesis |
| production_record_id | BIGINT (FK) | Alarmı tetikleyen üretim kaydı |
| alarm_type | VARCHAR | Şu an sadece: PRODUCTION_DEVIATION |
| severity | VARCHAR | UYARI (10-20% sapma) veya KRITIK (>20% sapma) |
| title | VARCHAR | Kısa alarm başlığı |
| description | VARCHAR | Sapma detaylarını içeren açıklama |
| status | VARCHAR | AKTIF veya COZULDU |
| created_at | TIMESTAMP | Alarm oluşturulma zamanı |
| resolved_at | TIMESTAMP | Çözüldüğü zaman (nullable) |
| resolved_by_id | BIGINT (FK) | Çözen kullanıcı (nullable) |

### 4.2 İlişki Diyagramı

```
Region (1) ──────< Facility (many)
                        │
                        │ (1)
                        ▼
                  ProductionRecord (many)
                        │
                        │ (1)
                        ▼
                     Alarm (many)
                        │
                        │ resolved_by (optional)
                        ▼
                      User

Region (1) ──────< User (many)
Facility (1) ────< User (many)
```

### 4.3 Başlangıç Verileri (DataInitializer.java)

Uygulama ilk başladığında, eğer veritabanı boşsa `DataInitializer` bean'i otomatik çalışır ve şu örnek verileri yükler:

**Bölgeler:**
- İç Anadolu (GES)
- Ege (GES)
- Karadeniz (HES)
- Akdeniz (HES)

**Tesisler:**
- GES Konya 1 → İç Anadolu
- GES Aksaray 1 → İç Anadolu
- GES İzmir 1 → Ege
- Baraj A → Karadeniz
- Baraj B → Akdeniz

**Kullanıcılar:** (şifrelerin tamamı `1234`)
- operator1 — TESIS_GOREVLISI — GES Konya 1 tesisine bağlı
- manager1 — TESIS_YONETICISI — İç Anadolu bölgesine bağlı
- region1 — BOLGE_YONETICISI — İç Anadolu bölgesine bağlı
- executive1 — UST_YONETICI — herhangi bir tesis/bölgeye bağlı değil

**Üretim Kayıtları:**  
Her tesis için 2026-03-23 ile 2026-03-29 arasında 7 günlük kayıtlar üretilir.

---

## 5. Backend Katmanı

Backend, klasik bir Spring Boot **Katmanlı Mimari** (Layered Architecture) ile kurulmuştur:

```
İstek
  │
  ▼
Controller  →  Service  →  Repository  →  PostgreSQL
  │                               ▲
  │  (DTO)                        │ (Entity)
  └───────────────────────────────┘
```

### 5.1 application.properties

`backend/src/main/resources/application.properties`

```properties
spring.application.name=backend

# Veritabanı bağlantısı
spring.datasource.url=jdbc:postgresql://localhost:5432/energy_forecast_db
spring.datasource.username=postgres
spring.datasource.password=7841
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate: her uygulama başlangıcında şemayı otomatik güncelle
spring.jpa.hibernate.ddl-auto=update

# Konsola SQL sorgularını yaz (debug için)
spring.jpa.show-sql=true

# Backend sunucu portu
server.port=8080
```

`ddl-auto=update` ayarı sayesinde entity sınıflarında yapılan her değişiklik sonraki başlatmada tablolara yansır; mevcut veriler silinmez.

---

### 5.2 Entity Sınıfları

Entity sınıfları, Java nesnelerini veritabanı tablolarına eşleyen JPA modelleridir.

#### `User.java`
- `@Entity` — tabloya eşlenir
- `@ManyToOne` ile `Region` ve `Facility`'ye yabancı anahtar bağlantısı vardır
- Giriş işleminde `username + password + role + plantType` kombinasyonu kontrol edilir

#### `Region.java`
- Bölge adı ve tesis tipini tutar
- `Facility` ve `User`'ın bağlandığı üst birimdir

#### `Facility.java`
- Tesis adı, tipi ve bağlı bölgeyi tutar
- `ProductionRecord`'ların üst birimidir

#### `ProductionRecord.java`
- Belirli bir tesis için belirli bir günün tahmin/gerçekleşen üretim değerlerini tutar
- Alarm hesaplaması bu kayıt üzerinden yapılır

#### `Alarm.java`
- `productionRecord`'dan türetilir
- `status` alanı `AKTIF` ya da `COZULDU` değerini alır
- `resolvedBy` nullable foreign key — çözülünce doldurulur

---

### 5.3 Repository Katmanı

Her entity için bir `JpaRepository` interface'i vardır. Özel sorgular `@Query` veya metod adı konvansiyonu ile yazılır.

| Repository | Önemli Metodlar |
|------------|-----------------|
| `UserRepository` | `findByUsernameAndPasswordAndRoleAndPlantType(...)` — giriş doğrulama |
| `RegionRepository` | Standart CRUD |
| `FacilityRepository` | Standart CRUD |
| `ProductionRecordRepository` | `findByFacilityIdAndRecordDateBetween(...)` — haftalık veri |
| `AlarmRepository` | `findByFacilityId(...)`, `existsByProductionRecordId(...)` |

Repository'ler doğrudan SQL yazmaz; Spring Data JPA bu sorguları otomatik üretir.

---

### 5.4 Service Katmanı

İş mantığı bu katmanda bulunur. Controller'lar doğrudan repository'lere erişmez; her zaman servis üzerinden geçer.

#### `AlarmGenerationService.java`

`generateAlarms()` metodu çağrıldığında şu adımları uygular:

```
1. Tüm ProductionRecord'ları veritabanından çek
2. Her kayıt için:
   a. Bu kayıt için daha önce alarm üretilmiş mi? → existsByProductionRecordId kontrol et
   b. Eğer alarm yoksa sapma hesapla:
      sapma% = |actualEnergy - predictedEnergy| / predictedEnergy × 100
   c. sapma% >= 20 → KRITIK alarm oluştur
      10 <= sapma% < 20 → UYARI alarm oluştur
      sapma% < 10 → alarm oluşturma
3. Yeni alarm nesnesi oluştur, status=AKTIF olarak kaydet
```

#### `ProductionChartService.java`

Grafik verilerini hazırlayan servis. Üç farklı seviye için veri döndürür:

- `getFacilityWeeklyChart(facilityId)` — tek tesisin son 7 günü
- `getRegionWeeklyChart(regionId)` — bölgedeki tüm tesislerin toplam üretimi, gün bazında toplar
- `getExecutiveWeeklyChart(plantType)` — sistemdeki tüm tesislerin toplam üretimi, tesis tipine göre filtreler

Her metod `ProductionChartPointDto` listesi döndürür: `{ date, predicted, actual }`

---

### 5.5 Controller Katmanı

Controller'lar HTTP isteklerini karşılar, service'i çağırır ve JSON yanıt döndürür.

#### `AuthController.java` — `/api/auth`

```
POST /api/auth/login
  ├─ Request Body: { username, password, role, plantType }
  ├─ Repository: UserRepository.findBy...(username, password, role, plantType)
  └─ Response:
       Başarılı → { success:true, userId, username, firstName, lastName,
                    role, plantType, region:{id,name}, facility:{id,name}, email, phone }
       Başarısız → { success:false, message:"Hatalı kullanıcı adı veya şifre" }
```

#### `UserController.java` — `/api/users`

```
GET /api/users/{id}
  └─ Kullanıcı bilgilerini döndürür

PUT /api/users/{id}
  ├─ Request Body: { username, password, email, phone }
  └─ Mevcut kullanıcıyı günceller
```

#### `FacilityController.java` — `/api/facilities`

```
GET /api/facilities
  └─ Tüm tesis listesini döndürür
```

#### `AlarmController.java` — `/api/alarms`

```
GET /api/alarms
  └─ Tüm alarmları listeler

POST /api/alarms/{id}/resolve?userId={userId}
  ├─ Alarm statusunu COZULDU yapar
  ├─ resolvedAt = şimdiki zaman
  └─ resolvedBy = userId'ye karşılık gelen User

POST /api/alarms/generate
  └─ AlarmGenerationService.generateAlarms() çağrısı yapar
```

#### `ProductionRecordController.java` — `/api/production-records`

```
GET /api/production-records
  └─ Tüm üretim kayıtları

GET /api/production-records/facility/{facilityId}/weekly
  └─ ProductionChartService.getFacilityWeeklyChart(facilityId)

GET /api/production-records/region/{regionId}/weekly
  └─ ProductionChartService.getRegionWeeklyChart(regionId)

GET /api/production-records/executive/weekly?plantType=GES|HES
  └─ ProductionChartService.getExecutiveWeeklyChart(plantType)
```

---

### 5.6 Config Sınıfları

#### `CorsConfig.java`
Frontend (5173) ile backend (8080) farklı portlarda çalıştığından tarayıcı CORS politikası engeller. Bu sınıf backend'e şunu söyler: *"5173 portundan gelen isteklere izin ver"*

```java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*");
```

#### `DataInitializer.java`
`CommandLineRunner` implementasyonu — uygulama başlarken `run()` metodu otomatik çalışır. Veritabanında hiç region yoksa örnek verileri (bölge, tesis, kullanıcı, üretim kaydı) yükler.

---

## 6. Frontend Katmanı

### 6.1 Giriş Noktası: main.jsx

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- `document.getElementById('root')` → `index.html`'deki `<div id="root">` elementine yapışır
- `BrowserRouter` → URL tabanlı sayfa yönlendirmesini aktif eder
- `React.StrictMode` → geliştirme modunda olası sorunlar için çift render yapar ve uyarı verir

---

### 6.2 App.jsx — Rota Haritası

Uygulamanın tüm URL yolları bu dosyada tanımlanır:

```
/                   → /tesis-secimi yönlendir
/tesis-secimi       → FacilitySelectionPage
/login              → LoginPage
/profile            → ProfilePage

/operator/dashboard → OperatorDashboardPage
/operator/alarms    → OperatorAlarmsPage
/operator/reports   → OperatorReportPage

/manager/dashboard  → ManagerDashboardPage
/manager/alarms     → ManagerAlarmsPage
/manager/reports    → ManagerReportPage

/regional/dashboard → RegionalDashboardPage
/regional/facilities → RegionalFacilitiesPage
/regional/facilities/:id → FacilityDetailPage
/regional/reports   → RegionalReportPage

/executive/dashboard → ExecutiveDashboardPage
/executive/regions  → ExecutiveRegionsPage
/executive/regions/:id → RegionDetailPage
/executive/reports  → ExecutiveReportPage
```

Aynı zamanda `IntroOverlay` bileşenini yönetir: uygulama ilk açıldığında animasyon biter bitmez `showOverlay` state'i false'a çekilir ve rotalar görünür hale gelir.

---

### 6.3 localStorage Kullanımı

Gerçek bir session/cookie altyapısı olmadığından kullanıcı verisi tarayıcının `localStorage`'ında tutulur:

| Anahtar | Ne zaman yazılır | Ne zaman okunur |
|---------|-----------------|----------------|
| `plantType` | FacilitySelectionPage'de tesis seçilince | LoginPage, tüm dashboard'lar |
| `userId` | Başarılı login sonrası | Profil, alarm çözme |
| `username` | Başarılı login sonrası | Sidebar, profil |
| `firstName` | Başarılı login sonrası | Dashboard hoş geldin mesajı |
| `lastName` | Başarılı login sonrası | Dashboard |
| `role` | Başarılı login sonrası | Sidebar menü seçimi |
| `facilityId` | Başarılı login sonrası | Operator/manager API çağrıları |
| `facilityName` | Başarılı login sonrası | Sayfa başlıkları |
| `regionId` | Başarılı login sonrası | Regional API çağrıları |
| `regionName` | Başarılı login sonrası | Sayfa başlıkları |
| `email` | Başarılı login sonrası | Profil sayfası |
| `phone` | Başarılı login sonrası | Profil sayfası |

**Çıkış işlemi:** `localStorage.clear()` çağrısı yapılarak tüm veriler silinir, ardından `/tesis-secimi`'ne yönlendirilir.

---

### 6.4 Sayfa Bileşenleri

#### FacilitySelectionPage.jsx
İlk açılan sayfa. Kullanıcıya GES veya HES seçeneği sunar.
- GES ya da HES kartına tıklayınca `localStorage.setItem('plantType', 'GES' ya da 'HES')` çalışır
- Ardından `/login`'e yönlendirir
- API çağrısı yoktur, tamamen istemci taraflıdır

#### LoginPage.jsx
Kimlik doğrulama sayfası.
- `localStorage`'dan `plantType` okunur, forma arka plan rengi belirlenir
- Kullanıcı 4 rolden birini seçer; formu gönderince:
  1. `POST /api/auth/login` isteği atılır
  2. Gelen yanıt localStorage'a yazılır
  3. Role göre ilgili dashboard'a yönlendirilir:
     - TESIS_GOREVLISI → `/operator/dashboard`
     - TESIS_YONETICISI → `/manager/dashboard`
     - BOLGE_YONETICISI → `/regional/dashboard`
     - UST_YONETICI → `/executive/dashboard`

#### ProfilePage.jsx
Kullanıcı profil yönetimi.
- Sayfa açılınca `GET /api/users/{userId}` çağrılır, bilgiler ekrana yansır
- "Kullanıcı Adı Değiştir" düğmesi modal açar; onaylanınca `PUT /api/users/{userId}` çağrılır
- "Şifre Değiştir" düğmesi ayrı modal açar; aynı endpoint kullanılır

---

### 6.5 Rol Bazlı Sayfalar

#### Operator (Tesis Görevlisi) Sayfaları

**OperatorDashboardPage.jsx**
- Sayfa açılınca `facilityId` ile üç paralel API çağrısı yapılır:
  - `GET /api/production-records` → toplam tahmin/gerçekleşen hesaplar
  - `GET /api/alarms` → aktif alarm sayısını hesaplar
  - `GET /api/production-records/facility/{facilityId}/weekly` → grafik verisi
- GES ise "Hava Durumu" paneli, HES ise "Su Akış Durumu" paneli render edilir (static veri)
- Öneriler paneli statik metinlerden oluşur

**OperatorAlarmsPage.jsx**
- `GET /api/alarms` ile tüm alarmlar gelir, `facilityId`'ye göre filtrelenir
- "Tümü / Kritik / Uyarı / Çözüldü" sekmeleriyle ek filtreleme
- Alarm satırına tıklayınca modal açılır; modalda "Çözüldü Olarak İşaretle" butonu vardır
- Butona basınca `POST /api/alarms/{alarmId}/resolve?userId={userId}` atılır
- İşlem başarılıysa alarm listesi yenilenir

**OperatorReportPage.jsx**
- `GET /api/production-records` ve `GET /api/alarms` ile veriler çekilir
- "Excel İndir" butonuna basınca XLSX kütüphanesi ile iki sayfalı (`Üretim`, `Alarmlar`) Excel dosyası oluşturulur
- `file-saver` ile tarayıcıya `Enerji_Raporu.xlsx` olarak indirilir

#### Manager (Tesis Yöneticisi) Sayfaları

**ManagerDashboardPage.jsx**
- Operator dashboard'una benzer, ancak yönetici bölge/tesis düzeyinde verileri görür
- Aynı API endpoint'leri kullanılır, farklı filtreleme mantığı uygulanır

**ManagerAlarmsPage.jsx**
- Bölge kapsamındaki tüm tesislerin alarmlarını listeler
- "Çözen Kişi" sütunu ile kim çözdüğü görünür

**ManagerReportPage.jsx**
- Çözen kişi bilgisiyle birlikte Excel dışa aktarma
- Dosya adı: `Tesis_Yonetici_Raporu.xlsx`

#### Regional (Bölge Yöneticisi) Sayfaları

**RegionalDashboardPage.jsx**
- `regionId` kullanılarak bölge bazlı metrikler hesaplanır
- `GET /api/production-records/region/{regionId}/weekly` ile haftalık bölge grafiği çizilir

**RegionalFacilitiesPage.jsx**
- `GET /api/facilities` ile tesis listesi alınır, `regionId` ile filtrelenir
- Her tesis kartına tıklayınca `navigate('/regional/facilities/:id')` çalışır

**FacilityDetailPage.jsx**
- URL parametresinden `facilityId` okunur
- `GET /api/production-records/facility/{facilityId}/weekly` ile grafik verisi çekilir
- `GET /api/alarms` ile bu tesise ait son alarmlar listelenir

**RegionalReportPage.jsx**
- İki rapor modu:
  1. **Bölge Özet Raporu** — bölgedeki tüm tesislerin verisi tek Excel'e
  2. **Tesis Seçimli Rapor** — modal üzerinden seçilen tesislerin verisini alır

#### Executive (Üst Yönetici) Sayfaları

**ExecutiveDashboardPage.jsx**
- `GET /api/production-records/executive/weekly?plantType={plantType}` ile sistem geneli grafik
- Toplam tesis, bölge, alarm sayıları hesaplanır

**ExecutiveRegionsPage.jsx**
- `GET /api/facilities` ile bölge listesi oluşturulur (facilities üzerinden gruplama)
- Bölge kartına tıklayınca `navigate('/executive/regions/:id')` çalışır

**RegionDetailPage.jsx**
- `GET /api/production-records/region/{regionId}/weekly` ile bölge haftalık grafiği

**ExecutiveReportPage.jsx**
- Üç rapor modu: Genel Özet, Bölge Seçimli, Tesis Seçimli
- En kapsamlı Excel export senaryosu

---

### 6.6 Bileşenler (Components)

#### DashboardLayout.jsx
Tüm dashboard sayfalarının çevresine sarılan kabuk bileşenidir.

```
┌─────────────────────────────────────────────┐
│  Sidebar  │      Ana İçerik Alanı            │
│           │  ┌───────────────────────────┐  │
│  [Menü]   │  │ Sayfa Başlığı             │  │
│  [Menü]   │  │ Kullanıcı Adı             │  │
│  [Menü]   │  │                           │  │
│           │  │  {children}               │  │
│  [Profil] │  │                           │  │
│  [Çıkış]  │  └───────────────────────────┘  │
└─────────────────────────────────────────────┘
```

Props olarak `pageTitle` alır. `localStorage`'dan `plantType` okuyarak tema rengini belirler (GES=yeşil, HES=mavi).

#### Sidebar.jsx
Sol navigasyon menüsü.
- `localStorage`'dan `role` okunur, role göre farklı menü öğeleri render edilir
- Her menü öğesi bir `<Link>` bileşenidir
- `useNavigate` ile `/tesis-secimi`'ne yönlendirip `localStorage.clear()` çağırarak çıkış yapar

#### ProductionChart.jsx
Tüm grafiklerde kullanılan yeniden kullanılabilir grafik bileşeni.

- **Girdi props:** `data` (dizi), `plantType` ('GES' veya 'HES')
- `data` dizisinin her elemanı: `{ date: "2026-03-23", predicted: 1200, actual: 1100 }`
- Recharts `ComposedChart` kullanır:
  - `Area` ile gerçekleşen üretim dolgu olarak gösterilir
  - `Line` (kesik) ile tahmin edilen üretim çizgi olarak gösterilir
  - `XAxis`, `YAxis`, `Tooltip`, `Legend` eklenmiştir
- GES için yeşil, HES için mavi renk paleti kullanılır

#### IntroOverlay.jsx
Uygulama ilk yüklendiğinde gösterilen açılış animasyonu.

- 4 animasyon fazı: giriş → başlık gösterimi → tagline → çıkış
- Her faz `setTimeout` ile sıralanır
- Son fazda `onComplete()` callback'i çağrılır → App.jsx `showOverlay`'i false yapar

---

### 6.7 Stil Dosyaları

| Dosya | İçerik |
|-------|--------|
| `index.css` | CSS değişkenleri (renkler, fontlar), global reset, GES/HES tema renkleri |
| `DashboardLayout.css` | Flex layout, içerik paneli, sayfa başlığı stilleri |
| `Sidebar.css` | 168px genişlik, menü item'ları, kullanıcı profil kutusu, çıkış butonu |
| `LoginPage.css` | Giriş formu, rol seçici grid, tema rengi geçişleri |
| `FacilitySelectionPage.css` | Seçim kartları, grid layout, ikon stilleri |
| `OperatorPages.css` | En büyük CSS (~19KB): metrik kartları, grafik container, alarm listesi, modaller, rapor stilleri |
| `ProfilePage.css` | Profil bilgi satırları, modal stilleri, form girdileri |

**CSS Değişkenleri (index.css):**

```css
/* GES teması */
--ges-primary: yeşil ton
--ges-secondary: açık yeşil

/* HES teması */
--hes-primary: mavi ton
--hes-secondary: açık mavi

/* Global */
--bg-dark: koyu arka plan
--card-bg: kart arka planı
--text-primary: ana metin rengi
--text-secondary: ikincil metin rengi
--border-color: kenarlık rengi
```

---

## 7. Birimler Arası İletişim

### 7.1 Frontend ↔ Backend

İletişim tamamen **HTTP/REST** üzerinden JSON formatında gerçekleşir.

```
Frontend (React)                 Backend (Spring Boot)
      │                                  │
      │  fetch('http://localhost:8080/api/...')
      │  headers: { 'Content-Type': 'application/json' }
      │ ─────────────────────────────────►
      │                                  │
      │              JSON yanıt          │
      │ ◄─────────────────────────────────
```

Frontend'de özel bir API istemci katmanı (Axios, api.js gibi) yoktur; her sayfa kendi `useEffect` hook'u içinde doğrudan `fetch()` kullanır.

**Tipik bir fetch bloğu:**
```javascript
useEffect(() => {
  fetch('http://localhost:8080/api/production-records/facility/3/weekly')
    .then(res => res.json())
    .then(data => setChartData(data))
    .catch(err => console.error(err));
}, []);
```

### 7.2 Backend ↔ Veritabanı

Backend, veritabanıyla **JPA (Hibernate)** üzerinden iletişim kurar. Uygulama katmanı hiçbir zaman raw SQL yazmaz; repository metodları veya JPQL sorguları kullanılır.

```
Service/Controller
      │
      │  repository.findByFacilityId(id)
      ▼
   JpaRepository (interface)
      │
      │  Hibernate SQL üretir:
      │  SELECT * FROM production_records WHERE facility_id = ?
      ▼
   PostgreSQL (jdbc:postgresql://localhost:5432/energy_forecast_db)
```

`spring.jpa.show-sql=true` ayarı sayesinde üretilen SQL sorguları konsola yazdırılır.

### 7.3 CORS Köprüsü

Frontend (5173) ve backend (8080) farklı portlarda çalıştığından tarayıcı güvenlik politikası gereği "farklı origin" sayılır. `CorsConfig.java` bunu çözer:

```
Tarayıcı           Frontend             Backend
   │                  │                    │
   │  localhost:5173   │                    │
   │ ─────────────── ►│                    │
   │                  │  OPTIONS (preflight)│
   │                  │ ──────────────────►│
   │                  │  Allow-Origin: *   │
   │                  │ ◄──────────────────│
   │                  │  GET/POST/...      │
   │                  │ ──────────────────►│
   │                  │  JSON yanıt        │
   │                  │ ◄──────────────────│
```

---

## 8. API Referansı

### Kimlik Doğrulama

| Method | Endpoint | Request Body | Yanıt |
|--------|----------|--------------|-------|
| POST | `/api/auth/login` | `{username, password, role, plantType}` | `{success, userId, role, plantType, facility, region, ...}` |

### Kullanıcı

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/users/{id}` | Kullanıcı bilgileri |
| PUT | `/api/users/{id}` | Kullanıcı bilgilerini güncelle |

### Tesisler

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/facilities` | Tüm tesisler |

### Üretim Kayıtları

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/production-records` | Tüm kayıtlar |
| GET | `/api/production-records/facility/{id}/weekly` | Tesis haftalık grafik verisi |
| GET | `/api/production-records/region/{id}/weekly` | Bölge haftalık grafik verisi |
| GET | `/api/production-records/executive/weekly?plantType=GES` | Sistem geneli haftalık grafik |

### Alarmlar

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/alarms` | Tüm alarmlar |
| POST | `/api/alarms/{id}/resolve?userId={uid}` | Alarmı çözdü olarak işaretle |
| POST | `/api/alarms/generate` | Sapma alarmlarını otomatik oluştur |

---

## 9. Örnek Aksiyon Akışları

Bu bölümde, gerçek bir kullanıcı aksiyonunun sistem katmanları arasında nasıl aktığı adım adım açıklanmaktadır.

---

### Akış 1: Kullanıcı Girişi

**Senaryo:** `operator1` adlı tesis görevlisi sisteme giriş yapar.

```
Adım 1 — Tesis Seçimi
────────────────────
FacilitySelectionPage render edilir.
Kullanıcı GES kartına tıklar.
  → localStorage.setItem('plantType', 'GES')
  → navigate('/login')

Adım 2 — Giriş Formu
────────────────────
LoginPage render edilir.
localStorage'dan plantType okunur → form arka planı yeşil tema ile çizilir.
Kullanıcı "Tesis Görevlisi" rolünü seçer.
Kullanıcı adı: operator1, şifre: 1234 girer ve "Giriş" düğmesine basar.

Adım 3 — HTTP İsteği
────────────────────
Frontend:
  fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'operator1',
      password: '1234',
      role: 'TESIS_GOREVLISI',
      plantType: 'GES'
    })
  })

Adım 4 — Backend İşleme
────────────────────────
AuthController.login() metodu çalışır.
  → UserRepository.findByUsernameAndPasswordAndRoleAndPlantType(
       'operator1', '1234', 'TESIS_GOREVLISI', 'GES'
    ) çağrısı yapılır.

  Hibernate SQL üretir:
    SELECT * FROM users
    WHERE username='operator1'
      AND password='1234'
      AND role='TESIS_GOREVLISI'
      AND plant_type='GES'
    LIMIT 1;

  PostgreSQL sonuç döndürür → User nesnesi oluşur.

Adım 5 — JSON Yanıt
────────────────────
Backend:
  {
    "success": true,
    "userId": 1,
    "username": "operator1",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "role": "TESIS_GOREVLISI",
    "plantType": "GES",
    "facility": { "id": 1, "name": "GES Konya 1" },
    "region": { "id": 1, "name": "İç Anadolu" },
    "email": "ahmet@enerji.com",
    "phone": "555-0001"
  }

Adım 6 — localStorage Yazımı
─────────────────────────────
Frontend:
  localStorage.setItem('userId', '1')
  localStorage.setItem('username', 'operator1')
  localStorage.setItem('firstName', 'Ahmet')
  ... (tüm alanlar)

Adım 7 — Yönlendirme
─────────────────────
navigate('/operator/dashboard')
```

---

### Akış 2: Operator Dashboard Yüklenmesi

**Senaryo:** Operator dashboard'una gelinir, grafik ve metrikler yüklenir.

```
Adım 1 — Sayfa Yüklenir
────────────────────────
OperatorDashboardPage mount edilir.
useEffect hook'u tetiklenir.
localStorage'dan facilityId okunur → örn. 3

Adım 2 — Paralel API Çağrıları
────────────────────────────────
Frontend aynı anda 3 istek atar:

  İstek A: GET /api/production-records
    → Tüm üretim kayıtları gelir
    → facilityId=3 olanlara filtre uygulanır
    → totalPredicted ve totalActual hesaplanır
    → State'e yazılır → metrik kartları render edilir

  İstek B: GET /api/alarms
    → Tüm alarmlar gelir
    → facilityId=3 ve status=AKTIF filtresi
    → activeAlarmCount hesaplanır
    → State'e yazılır → alarm sayacı güncellenir

  İstek C: GET /api/production-records/facility/3/weekly
    → Backend ProductionChartService.getFacilityWeeklyChart(3) çalışır:
        Son 7 günü hesaplar (LocalDate.now() - 7)
        ProductionRecord WHERE facility_id=3 AND date BETWEEN ... sorgular
        List<ProductionChartPointDto> döndürür:
        [
          { date:"2026-03-25", predicted:1200.0, actual:1150.0 },
          { date:"2026-03-26", predicted:1300.0, actual:1280.0 },
          ...
        ]
    → State'e yazılır

Adım 3 — Grafik Render
───────────────────────
chartData state'i dolunca ProductionChart bileşeni render edilir.
Props: data=chartData, plantType='GES'
Recharts, veriyi ComposedChart olarak çizer:
  - actualEnergy → yeşil dolgu alan
  - predictedEnergy → yeşil kesik çizgi
```

---

### Akış 3: Alarm Çözme

**Senaryo:** Operator, kritik bir alarmı çözdü olarak işaretler.

```
Adım 1 — Alarm Listesi
────────────────────────
OperatorAlarmsPage yüklenirken GET /api/alarms çağrısı yapılır.
facilityId=3 olan alarmlar filtrelenir.
"Kritik" sekmesinde alarm ID=7 görünür.

Adım 2 — Modal Açma
────────────────────
Kullanıcı alarm satırına tıklar.
selectedAlarm state'i alarm nesnesiyle doldurulur.
Modal render edilir — alarm detayları gösterilir.

Adım 3 — Çözme İşlemi
──────────────────────
"Çözüldü Olarak İşaretle" butonuna basılır.
Frontend:
  fetch('http://localhost:8080/api/alarms/7/resolve?userId=1', {
    method: 'POST'
  })

Adım 4 — Backend İşleme
────────────────────────
AlarmController.resolveAlarm(7, 1) çalışır.
  → AlarmRepository.findById(7) → Alarm nesnesi
  → UserRepository.findById(1) → User nesnesi (Ahmet Yılmaz)
  → alarm.status = "COZULDU"
  → alarm.resolvedAt = LocalDateTime.now()
  → alarm.resolvedBy = user
  → AlarmRepository.save(alarm)

  Hibernate SQL:
    UPDATE alarms
    SET status='COZULDU', resolved_at=NOW(), resolved_by_id=1
    WHERE id=7;

Adım 5 — Yanıt ve Yenileme
────────────────────────────
Backend → 200 OK döner
Frontend → modal kapanır
alarms state yeniden GET /api/alarms ile güncellenir
Alarm listesi tekrar render edilir, ID=7 artık "Çözüldü" sekmesinde görünür
```

---

### Akış 4: Excel Raporu İndirme

**Senaryo:** Tesis yöneticisi bölge raporunu Excel olarak indirir.

```
Adım 1 — Sayfa Yüklenir
────────────────────────
ManagerReportPage mount edilir.
GET /api/production-records çağrısı yapılır.
GET /api/alarms çağrısı yapılır.
Veriler state'e yazılır.

Adım 2 — İndirme Butonu
────────────────────────
"Excel İndir" butonuna basılır.
handleExport() fonksiyonu çalışır.

Adım 3 — Excel Oluşturma (tamamen frontend, API yok)
─────────────────────────────────────────────────────
XLSX kütüphanesi ile:
  const wb = XLSX.utils.book_new();

  // Sheet 1: Üretim
  const productionData = productionRecords.map(r => ({
    Tarih: r.recordDate,
    'Tahmin (kWh)': r.predictedEnergy,
    'Gerçekleşen (kWh)': r.actualEnergy,
    'Sapma (%)': ((r.actualEnergy - r.predictedEnergy) / r.predictedEnergy * 100).toFixed(1)
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productionData), 'Üretim');

  // Sheet 2: Alarmlar (çözen kişi bilgisi ile)
  const alarmData = alarms.map(a => ({
    Başlık: a.title,
    Şiddet: a.severity,
    Durum: a.status,
    'Çözen Kişi': a.resolvedBy ? a.resolvedBy.firstName + ' ' + a.resolvedBy.lastName : '-',
    ...
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(alarmData), 'Alarmlar');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

Adım 4 — Dosya İndirme
───────────────────────
file-saver:
  saveAs(
    new Blob([excelBuffer], { type: 'application/octet-stream' }),
    'Tesis_Yonetici_Raporu.xlsx'
  );
Tarayıcı dosyayı kullanıcının İndirilenler klasörüne kaydeder.
```

---

### Akış 5: Otomatik Alarm Üretimi

**Senaryo:** Yeni üretim kayıtları sisteme girildikten sonra alarm oluşturma tetiklenir.

```
Adım 1 — Tetikleme
────────────────────
POST /api/alarms/generate çağrısı yapılır.
(Manuel veya uygulama başlangıcında)

Adım 2 — AlarmGenerationService.generateAlarms()
──────────────────────────────────────────────────
ProductionRecordRepository.findAll() → tüm kayıtlar
Her kayıt için:

  Kayıt: facility_id=1, date=2026-03-25, predicted=1200, actual=900

  AlarmRepository.existsByProductionRecordId(kayıt.id) → false (daha önce alarm yok)

  sapma = |900 - 1200| / 1200 × 100 = 25%

  25 > 20 → KRITIK

  Yeni Alarm nesnesi:
    alarmType = "PRODUCTION_DEVIATION"
    severity = "KRITIK"
    title = "Kritik Üretim Sapması"
    description = "25.0% sapma tespit edildi"
    status = "AKTIF"
    createdAt = now()
    facility = Facility(id=1)
    productionRecord = kayıt

  AlarmRepository.save(alarm) → INSERT INTO alarms ...

Adım 3 — Sonuç
───────────────
Her kayıt kontrol edilir, sadece eşiği geçenler için alarm oluşturulur.
Zaten alarm olan kayıtlar tekrar işlenmez.
Backend → tüm işlemler bittikten sonra 200 OK döner.
```

---

## 10. Başlatma ve Kurulum

### Gereksinimler
- Node.js ≥ 18
- Java 17
- Maven
- PostgreSQL (port 5432)

### PostgreSQL Kurulum
```sql
CREATE DATABASE energy_forecast_db;
-- Kullanıcı: postgres, Şifre: 7841
```

### Backend Başlatma
```bash
cd backend
mvn clean install
mvn spring-boot:run
# → http://localhost:8080 adresinde çalışır
# → Uygulama başlayınca DataInitializer örnek verileri yükler
```

### Frontend Başlatma
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173 adresinde çalışır
```

### Production Build (Frontend)
```bash
npm run build    # dist/ klasörü oluşur
npm run preview  # dist/ klasörünü önizle
```

---

## 11. Test Hesapları

Sistem ilk başlatıldığında `DataInitializer` tarafından otomatik oluşturulan hesaplar:

| Kullanıcı Adı | Şifre | Rol | Tesis Tipi | Bağlı Tesis/Bölge |
|--------------|-------|-----|-----------|-----------------|
| operator1 | 1234 | Tesis Görevlisi | GES | GES Konya 1 |
| manager1 | 1234 | Tesis Yöneticisi | GES | İç Anadolu |
| region1 | 1234 | Bölge Yöneticisi | GES | İç Anadolu |
| executive1 | 1234 | Üst Yönetici | GES | — |

> Tüm HES rolleri için eşdeğer kullanıcılar farklı isimlerle tanımlanmıştır. Mevcut DataInitializer konfigürasyonuna göre oluşturulmuş kullanıcı listesi için `DataInitializer.java` dosyasına bakılabilir.

---

*Bu doküman projenin mevcut durumunu yansıtmaktadır (2026-04-01 itibarıyla). Kod tabanında yapılacak değişikliklerde ilgili bölümlerin güncellenmesi önerilir.*
