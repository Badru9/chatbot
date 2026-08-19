# Use Case Diagram — Portal Dosen & Asisten Virtual (ITG)

### Penjelasan Diagram
Diagram Use Case ini memodelkan seluruh interaksi fungsional utama antara sistem dengan dua aktor utama, yaitu **Dosen** dan **Admin**. Seluruh use case yang membutuhkan autentikasi memiliki relasi `<<include>>` ke use case *Login*, dengan catatan batasan privasi bahwa Admin tidak memiliki hak akses terhadap isi dokumen pribadi milik Dosen.

```plantuml
@startuml
title Use Case Diagram Portal Dosen & Asisten Virtual - Institut Teknologi Garut

left to right direction
skinparam packageStyle rectangle
skinparam shadowing false
skinparam monochrome false
skinparam actorStyle awesome

actor "Dosen" as dosen
actor "Admin" as admin

rectangle "Portal Dosen & Plugin Asisten Virtual (ITG)" {
  ' Autentikasi
  usecase "Login" as UC_Login

  ' Domain: Asisten Virtual
  usecase "Chat dengan Asisten Virtual" as UC_Chat
  usecase "Upload Dokumen (PDF)\nke Library" as UC_UploadDoc
  usecase "Gunakan Dokumen dari Library\nsebagai Konteks" as UC_UseDoc
  usecase "Kelola Riwayat Percakapan\n(History & New Chat)" as UC_History

  ' Domain: Jadwal Mengajar
  usecase "Ekstrak Jadwal Mengajar\ndari PDF" as UC_ExtractJadwal
  usecase "Lihat & Kelola\nJadwal Mengajar" as UC_KelolaJadwal

  ' Domain: AISnet
  usecase "Lihat Data Keuangan\nPenelitian/PkM (AISnet)" as UC_ViewAISnet
  usecase "Tanya Asisten AI\ntentang Data AISnet" as UC_AskAISnet

  ' Domain: Admin
  usecase "Kelola Data & Akses Sistem" as UC_ManageSystem
  usecase "Lihat Data AISnet\n(Seluruh Dosen)" as UC_AdminAISnet
}

' Relasi Aktor Dosen
dosen --> UC_Chat
dosen --> UC_UploadDoc
dosen --> UC_ExtractJadwal
dosen --> UC_KelolaJadwal
dosen --> UC_ViewAISnet
dosen --> UC_AskAISnet
dosen --> UC_History

' Relasi Aktor Admin
admin --> UC_ManageSystem
admin --> UC_AdminAISnet

' Include Relasi ke Login untuk semua use case yang memerlukan otentikasi
UC_Chat ..> UC_Login : <<include>>
UC_UploadDoc ..> UC_Login : <<include>>
UC_ExtractJadwal ..> UC_Login : <<include>>
UC_KelolaJadwal ..> UC_Login : <<include>>
UC_ViewAISnet ..> UC_Login : <<include>>
UC_AskAISnet ..> UC_Login : <<include>>
UC_History ..> UC_Login : <<include>>
UC_ManageSystem ..> UC_Login : <<include>>
UC_AdminAISnet ..> UC_Login : <<include>>

' Include Relasi Konteks Dokumen
UC_Chat ..> UC_UseDoc : <<include>>

' Constraint Note Privasi Dokumen
note right of admin
  **Constraint Privasi:**
  Admin tidak memiliki akses ke
  isi dokumen pribadi yang diupload
  dosen ke asisten virtual.
end note

@enduml
```
