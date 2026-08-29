# Architecture & Design Specification: Pemisahan Dashboard Admin ke `/dashboard`

**Tanggal:** 29 Agustus 2026  
**Status:** Approved by User  
**Tujuan:** Memisahkan halaman dan navigasi admin dari layout portal dosen (`PortalLayout`) menjadi arsitektur Dashboard mandiri (`DashboardLayout` di bawah `/dashboard`) dengan sidebar navigasi terpadu, overview statistik, dan perlindungan otentikasi role-based.

---

## 1. Latar Belakang & Masalah
Sebelumnya, modul administrasi (`/admin/menus`, `/admin/datasets`, `/admin/users`, `/admin/settings`) masing-masing di-wrap langsung menggunakan `<PortalLayout>`, yaitu layout khusus portal dosen/pengguna yang berfokus pada konten di tengah layar, FAB Profile & Chatbot AI floating button.

Hal ini mengakibatkan:
1. Tidak ada navigasi sidebar antar modul admin sehingga admin harus kembali ke menu portal utama untuk berpindah modul.
2. Tidak ada halaman ringkasan / overview dashboard terpusat.
3. Tampilan admin terasa seperti halaman modal/portal biasa bukan dashboard operasional yang efisien.

---

## 2. Keputusan Arsitektur (ADR)

### ADR-01: Struktur Routing Bersarang (`/dashboard/*`)
- **Keputusan:** Seluruh fitur admin dipindahkan ke bawah namespace `/dashboard`.
  - `/dashboard`: Overview / Ringkasan Statistik, Status Sistem AI, dan Pintasan Cepat.
  - `/dashboard/menus`: Kelola Menu Portal Akademik.
  - `/dashboard/datasets`: Kelola Dataset AI & Dokumen Pengetahuan.
  - `/dashboard/users`: Kelola Akun Dosen & Admin.
  - `/dashboard/settings`: Pengaturan Model AI (Gemini & Ollama).
- **Next.js Layout:** Menggunakan `app/dashboard/layout.tsx` sebagai layout global untuk semua halaman di bawah `/dashboard`, sehingga sidebar dan topbar persisten tanpa render ulang.
- **Backward Compatibility / Redirect:** Menambahkan redirect di `next.config.ts` atau middleware dari `/admin/:path*` ke `/dashboard/:path*`.

### ADR-02: DashboardLayout & Komponen Navigasi
- **Komponen:**
  - **Sidebar Modern:**
    - Logo & Identitas Aplikasi (`mb.ai Admin`)
    - Navigasi Vertikal dengan Phosphor Icons & active route indicator
    - Bottom Action: Profil ringkas & tombol logout
    - Mobile Responsive: Drawer/Sheet toggle untuk layar kecil (HP/Tablet)
  - **Topbar / Header:**
    - Breadcrumb / Nama Halaman Aktif
    - Tombol cepat "Kembali ke Portal Dosen" (Link ke `/`)
    - Indikator Status Role (`Admin`)
  - **Main Content Area:** Kontainer dinamis dengan padding dan background neutral yang kontras dan bersih.

### ADR-03: Auth & Access Control
- `DashboardLayout` memanfaatkan hook `useSession()`:
  - Jika sesi masih loading: tampilkan skeleton/spinner dashboard.
  - Jika user belum login atau `user.role !== 'admin'`: otomatis redirect ke `/` (halaman utama portal) dan tampilkan toast error "Akses ditolak: Hanya admin yang dapat mengakses Dashboard".

### ADR-04: Navigasi Portal Utama (`ProfileFab`)
- Dropdown menu pada `ProfileFab` diperbarui: tombol khusus admin disederhanakan menjadi 1 menu utama berlabel **"Dashboard Admin"** yang mengarah ke `/dashboard`.

---

## 3. Rencana Komponen & Halaman

```
app/
├── (portal)/...              # Portal Dosen
├── dashboard/
│   ├── layout.tsx            # Root Dashboard Layout (Auth Guard + Sidebar + Topbar)
│   ├── page.tsx              # Overview / Index Page (Stats, Shortcuts, AI Status)
│   ├── components/
│   │   ├── DashboardLayout.tsx # Layout Shell (Sidebar, Topbar, Responsive Wrapper)
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardTopbar.tsx
│   │   ├── StatCards.tsx     # Ringkasan Total Menu, Dataset, User, Status AI
│   │   ├── QuickActions.tsx  # Pintasan Tambah Menu/Dataset/User/Cek AI
│   │   └── SystemAiStatus.tsx # Kartu status aktif Gemini / Ollama
│   ├── menus/
│   │   ├── page.tsx          # Menggunakan layout tanpa PortalLayout
│   │   ├── MenusLoading.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── datasets/
│   │   ├── page.tsx
│   │   ├── components/
│   │   └── utils/
│   ├── users/
│   │   ├── page.tsx
│   │   ├── UsersLoading.tsx
│   │   ├── components/
│   │   └── hooks/
│   └── settings/
│       ├── page.tsx
│       └── components/
```

---

## 4. Glossarium Istilah
- **Portal:** Tampilan publik/dosen untuk mengakses layanan akademik dan asisten virtual AI.
- **Dashboard Admin:** Area operasional khusus pengguna ber-role `admin` untuk mengelola data master, dataset AI, dan konfigurasi sistem.
- **Auth Guard:** Pengecekan status login dan verifikasi role `admin` sebelum merender konten dashboard.
- **FAB (Floating Action Button):** Tombol melayang di pojok kanan bawah pada portal utama.

---

## 5. Rencana Verifikasi
1. **Verifikasi Navigasi:** Memastikan klik antar menu di sidebar (`/dashboard`, `/dashboard/menus`, `/dashboard/datasets`, `/dashboard/users`, `/dashboard/settings`) berpindah halaman dengan lancar dan state active menu sesuai URL.
2. **Verifikasi CRUD:** Menguji fungsionalitas CRUD di Menu, Dataset, User, dan AI Settings tetap berfungsi 100% tanpa regresi.
3. **Verifikasi Auth Guard:** Menguji akses sebagai non-admin / belum login untuk memastikan redirect ke `/` berjalan aman.
4. **Verifikasi Mobile:** Menguji tampilan responsif pada layar kecil (drawer sidebar berfungsi).
