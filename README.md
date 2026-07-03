# 📢 SIPEMA - Sistem Pengaduan Masyarakat

SIPEMA (Sistem Pengaduan Masyarakat) adalah aplikasi berbasis **Web** dan **Mobile** yang dikembangkan untuk membantu masyarakat dalam menyampaikan laporan mengenai permasalahan di lingkungan sekitar secara cepat, mudah, dan transparan. Setiap laporan yang dikirim dapat dipantau oleh admin hingga proses penyelesaiannya sehingga meningkatkan kualitas pelayanan kepada masyarakat.

---

# 🚀 Fitur

## 👤 Masyarakat

- Registrasi akun
- Login pengguna
- Membuat laporan pengaduan
- Upload foto laporan
- Melihat riwayat laporan
- Melihat status laporan
- Mengelola profil pengguna

## 👨‍💼 Admin

- Login Admin
- Dashboard Admin
- Melihat seluruh laporan masyarakat
- Mengubah status laporan
- Mengelola kategori laporan
- Mengelola data pengguna
- Memantau perkembangan laporan

---

# 🛠️ Teknologi yang Digunakan

## Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- Multer
- bcrypt
- dotenv
- CORS

## Frontend Web

- React.js
- React Router DOM
- Axios

## Frontend Mobile

- React Native
- Expo
- React Navigation
- Axios

---

# 📂 Struktur Project

```text
Sistem-Pengaduan
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   ├── package.json
│   └── server.js
│
├── frontend-mobile
│   ├── assets
│   ├── src
│   ├── App.tsx
│   └── package.json
│
├── frontend-web
│   ├── public
│   ├── src
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# ⚙️ Cara Menjalankan Project

## 1. Clone Repository

```bash
git clone https://github.com/bayu-006/Sistem-Pengaduan.git
```

---

## 2. Menjalankan Backend

Masuk ke folder backend

```bash
cd backend
```

Install dependency

```bash
npm install
```

Jalankan server

```bash
npm start
```

atau

```bash
node server.js
```

---

## 3. Menjalankan Frontend Web

Masuk ke folder frontend-web

```bash
cd frontend-web
```

Install dependency

```bash
npm install
```

Jalankan aplikasi

```bash
npm start
```

---

## 4. Menjalankan Frontend Mobile

Masuk ke folder frontend-mobile

```bash
cd frontend-mobile
```

Install dependency

```bash
npm install
```

Jalankan aplikasi

```bash
npx expo start
```

---

# 🗄️ Konfigurasi Database

Import database MySQL terlebih dahulu, kemudian buat file **.env** pada folder **backend** dan sesuaikan konfigurasi berikut.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistem_pengaduan
JWT_SECRET=your_secret_key
```

---

# 📸 Tampilan Aplikasi

Tambahkan screenshot aplikasi pada bagian berikut.

## Halaman Login

*(Tambahkan gambar di sini)*

## Dashboard Admin

*(Tambahkan gambar di sini)*

## Halaman Pengaduan

*(Tambahkan gambar di sini)*

## Aplikasi Mobile

*(Tambahkan gambar di sini)*

---

# 👨‍💻 Pengembang

**Bayu Nur**

Project ini dikembangkan sebagai bagian dari pengembangan aplikasi **SIPEMA (Sistem Pengaduan Masyarakat)** berbasis Web dan Mobile.

---

# 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran, penelitian, dan pengembangan aplikasi Sistem Pengaduan Masyarakat.
