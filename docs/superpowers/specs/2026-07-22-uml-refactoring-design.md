# Spesifikasi Pembaruan Diagram UML System Chatbot & Portal Dosen

**Tanggal**: 22 Juli 2026  
**Status**: Draft / Superpowers Spec  
**Target Folder**: [`d:\Badru\Projects\chatbot\uml`](file:///d:/Badru/Projects/chatbot/uml)

---

## 1. Latar Belakang & Tujuan
Diagram UML di folder `d:\Badru\Projects\chatbot\uml` perlu diperbarui secara menyeluruh karena sistem telah mengalami pengembangan fitur dan alur arsitektur yang signifikan. Arsitektur terbaru mencakup:
1. **Frontend Next.js** ([`chatbot`](file:///d:/Badru/Projects/chatbot)) dengan `AiFab`, `AiAssistantModal`, `Chatbot` dengan streaming response dari Ollama (`qwen3.5`), pencarian kontekstual dokumen via mention `@`, pratinjau PDF interaktif berbasis IndexedDB (`react-pdf`), serta riwayat chat di `localStorage`.
2. **Backend API Express & Prisma** ([`api-chatbot`](file:///d:/Badru/Projects/api-chatbot)) dengan PostgreSQL & `pgvector` (`vectors` / `PdfChunk`), Better-Auth (`User`, `Session`, `Account`), dan manajemen menu portal (`PortalMenu`).
3. **Dashboard Admin Dataset** (`/admin/datasets`) untuk ringkasan statistik (Total Dokumen & Total Vector Chunks), upload PDF global, dan penghapusan dokumen.

---

## 2. Cakupan Pembaruan Diagram (11 Files)

### 2.1 `use_case.md`
- **Aktor**: `Dosen`, `Admin / USI`.
- **Fitur Dosen**:
  - Membuka Portal & Platform Eksternal (AISNET, E-Learning, Bimbingan, SINTA).
  - Autentikasi (`Login`, `Logout`, `Profil`).
  - Mengelola Dokumen Pribadi (Upload PDF, Hapus Dokumen, Pratinjau PDF via IndexedDB).
  - Menggunakan Chatbot Personal (Akses via `AiFab`, Mention Dokumen via `@`, Streaming Response, Simpan Riwayat di `localStorage`).
- **Fitur Admin**:
  - Mengelola Menu Portal (`/admin/menus`).
  - Mengelola Dataset Institusi & Lihat Statistik Chunk (`/admin/datasets`).
  - Mengelola Akun Dosen (`/admin/users`).

### 2.2 `class.md`
- **Database Entities (Prisma Backend)**:
  - `User`: id, name, email, emailVerified, password, image, role ("admin" | "dosen"), createdAt, updatedAt.
  - `Session`: id, expiresAt, token, ipAddress, userAgent, userId, createdAt, updatedAt.
  - `Account`: id, accountId, providerId, userId, password, accessToken, refreshToken, scope, createdAt, updatedAt.
  - `PdfChunk` (`vectors`): id, documentId, documentName, documentHash, pageNumber, chunkIndex, chunkText, tokenCount, embedding (vector(1024)), metadata (Json, e.g. userId), createdAt.
  - `PortalMenu` (`portal_menu`): id, title, description, icon, href, order, visibleToRoles (String[]), createdBy, createdAt, updatedAt.
- **Client State Entities**:
  - `ChatHistory`: id, title, messages (Array), createdAt, updatedAt (Penyimpanan di `localStorage`).
  - `LocalPdfBlob`: documentId, fileName, fileBlob, createdAt (Penyimpanan di `IndexedDB`).
- **Services**:
  - `ChatService`: retrievePdfContext, streamOllamaChat.
  - `DocumentService`: ingestPdfBuffer, deleteDocumentChunks.
  - `MenuService`: getMenus, createMenu, updateMenu, deleteMenu, reorderMenus.

### 2.3 `activity.md`
- Alur Aktivitas menyeluruh dari Pengunjung/Dosen/Admin:
  - Melihat Portal -> Klik Platform Eksternal.
  - Login Session -> Dosen mengakses FAB AI -> Buka Modal Chat -> Mention Document `@` -> Streaming Ollama Answer.
  - Dosen Upload PDF -> Server Ingestion (`pdf-parse`, chunking, Ollama `bge-m3` embedding, `pgvector`) -> Local IndexedDB storage -> PDF Preview Modal.
  - Admin Panel -> Dataset Stats & Upload/Delete -> Menu Portal Reorder & CRUD -> Lecturer Account CRUD.

### 2.4 `chatbot_sequence.md`
- Dosen -> `AiFab` -> `AiAssistantModal` -> Ketik Pertanyaan + `@mention` document.
- Next.js Client -> Express Backend (`POST /api/chat`).
- Backend -> `requireAuth` -> `retrievePdfContext` -> Query `vectors` (`PdfChunk`) via cosine distance di PostgreSQL (`pgvector`) difilter per `userId`.
- Backend -> Prompt construction -> Call Ollama (`/api/chat`, `stream: true`).
- Ollama -> Chunked stream -> Express Backend -> HTTP Chunked Response -> Next.js Client -> Stream update UI & `localStorage`.

### 2.5 `document_sequence.md`
- Dosen -> Halaman Dokumen (`/documents`) -> Upload PDF.
- Frontend -> API (`POST /api/documents`).
- Backend -> `pdf-parse` -> chunking -> Ollama embedding -> Save `PdfChunk` (`vectors`) di PostgreSQL.
- Frontend -> Save PDF File to IndexedDB (`LocalPdfBlob`).
- Frontend -> List refresh (React Query) -> Click Preview -> Load PDF from IndexedDB (`react-pdf`).

### 2.6 `manage_dataset_sequence.md`
- Admin -> Halaman `/admin/datasets`.
- Frontend -> API (`GET /api/documents` sebagai admin).
- Backend -> Aggregate `PdfChunk` (`groupBy documentId, documentName`), return list + aggregate stats (total documents, total chunks).
- Admin -> Upload global PDF / Delete document -> API (`DELETE /api/documents/:id`) -> `deleteDocumentChunks`.

### 2.7 `manage_portal_sequence.md`
- Admin -> Panel `/admin/menus`.
- GET `/api/menus` -> Render list.
- Admin CRUD & Drag-and-drop Reorder -> PUT `/api/menus/reorder`.

### 2.8 `manage_lecturer_sequence.md`
- Admin -> Panel `/admin/users`.
- Pengelolaan akun dosen (Tambah, Edit, Nonaktifkan, Hapus) terhubung dengan Better-Auth `User` & `Account`.

### 2.9 `open_platform_sequence.md`
- Dosen -> Buka Portal -> GET `/api/menus` -> Render `PortalGrid` -> Klik Card -> Open `href` di tab baru (`_blank`).

### 2.10 `login_sequence.md`
- User -> `LoginForm` -> POST login -> Verify password hash -> Generate `Session` -> Return user role -> Render `ProfileFab` & `AiFab`.

### 2.11 `reset_password_sequence.md`
- Admin -> User management -> Reset password -> Update hash password di table `Account` / `User`.

---

## 3. Rencana Verifikasi
- Memastikan seluruh kode PlantUML di 11 file markdown memiliki sintaks yang valid (`@startuml` s.d. `@enduml`).
- Verifikasi keberadaan semua file di folder `uml`.
