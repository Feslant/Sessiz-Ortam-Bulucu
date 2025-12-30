*Sessiz Ortam Bulucu*

Öğrenciler, freelance çalışanlar ve odaklanmak isteyen bireyler için geliştirilmiş; sessiz çalışma alanlarını (kütüphane, kafe, park vb.) harita üzerinde gösteren 
mobil uygulama.

🚀 Proje Hakkında

Bu proje, Kullanıcıların gürültüden uzaklaşıp verimli çalışabilecekleri mekanları keşfetmelerini ve uygulama içi araçlarla odaklanmalarını sağlar.

🎯 Temel Özellikler

📍 Canlı Harita & GPS: Kullanıcının konumuna göre en yakın sessiz alanları (Kütüphane, Kafe, Park) harita üzerinde gösterir.

🚦 Yoğunluk Katmanı: Google Haritalar altyapısı ile bölgedeki yoğunluk durumunu görselleştirir.

🎶 Odaklanma Modu: İnternet gerektirmeden çalışan; Klasik, Pop ve Doğa seslerinden oluşan entegre müzik çalar.

👤 Profil & Favoriler: Kullanıcılar beğendikleri mekanları favorilerine ekleyebilir ve profil fotoğraflarını güncelleyebilir.

💬 Sosyal Etkileşim: Mekanlara yorum yapma, puan verme ve "Check-in" özelliği.

📋 Liste Görünümü: Mekanları isim ve kategoriye göre filtreleme imkanı.

🛠️ Kullanılan Teknolojiler

Bu proje, modern mobil uygulama geliştirme standartlarına uygun olarak aşağıdaki teknolojilerle geliştirilmiştir:

Alan

Teknoloji

Framework

React Native (Expo SDK 52)

Dil

TypeScript / JavaScript

Backend

Firebase (Firestore, Authentication, Storage)

Harita

React Native Maps & Google Maps API

Medya

Expo AV (Audio/Video)

Depolama

Async Storage & Firebase Storage

📱 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

Repoyu Klonlayın:

git clone [https://github.com/KULLANICI_ADINIZ/sessiz-ortam-bulucu.git](https://github.com/KULLANICI_ADINIZ/sessiz-ortam-bulucu.git)
cd sessiz-ortam-bulucu


Bağımlılıkları Yükleyin:

npm install


Uygulamayı Başlatın:

npx expo start


Test Edin:

Terminalde çıkan QR kodu telefonunuzdaki Expo Go uygulaması ile okutun.

Veya a tuşuna basarak Android Emülatörde çalıştırın.

📂 Proje Yapısı

sessiz-ortam-bulucu/
├── app/                 # Ekranlar ve Sayfa Yönlendirmeleri (Expo Router)
│   ├── (tabs)/          # Alt Menü Sayfaları (Harita, Müzik, Profil...)
│   ├── index.tsx        # Açılış Ekranı
│   └── _layout.tsx      # Ana Navigasyon Ayarları
├── assets/              # Resimler, Fontlar ve Müzik Dosyaları
├── components/          # Tekrar Kullanılabilir Bileşenler
├── config/              # Firebase Ayar Dosyaları
└── firebaseConfig.ts    # Veritabanı Bağlantısı

