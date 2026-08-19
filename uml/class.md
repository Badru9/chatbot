# Class Diagram — Portal Dosen & Asisten Virtual (ITG)

### Penjelasan Diagram
Diagram kelas tunggal ini merepresentasikan struktur model data inti seluruh sistem, hubungan pewarisan `User` ke `Dosen` dan `Admin`, relasi kepemilikan dokumen pribadi dosen, serta batasan privasi data antara Admin dan Dokumen Dosen.

```plantuml
@startuml
title Class Diagram - Portal Dosen & Asisten Virtual (ITG)

skinparam classAttributeIconSize 0
skinparam monochrome false
skinparam shadowing false

abstract class User {
  - id: String
  - nama: String
  - email: String
  - passwordHash: String
  - role: String
  - createdAt: DateTime
  + login(): Boolean
  + logout(): Void
}

class Dosen {
  - nidn: String
  - prodi: String
  - fakultas: String
}

class Admin {
  - nip: String
  + manageSystemAccess(): Void
}

class ChatSession {
  - id: String
  - userId: String
  - title: String
  - createdAt: DateTime
  - updatedAt: DateTime
  + createNewChat(): ChatSession
  + getHistory(): List<Message>
}

class Message {
  - id: String
  - sessionId: String
  - senderType: String
  - content: String
  - attachedDocId: String
  - timestamp: DateTime
}

class Dokumen {
  - id: String
  - ownerId: String
  - fileName: String
  - filePath: String
  - fileSize: Integer
  - mimeType: String
  - uploadedAt: DateTime
  - parsedContent: String
}

class JadwalMengajar {
  - id: String
  - dosenId: String
  - kodeMK: String
  - namaMK: String
  - kelas: String
  - hari: String
  - jamMulai: String
  - jamSelesai: String
  - ruangan: String
  - sks: Integer
  - semester: String
  - tahunAkademik: String
}

class DataKeuanganPenelitian {
  - id: String
  - dosenId: String
  - judulPenelitian: String
  - skema: String
  - tahunAnggaran: String
  - nominalDisetujui: Decimal
  - statusPencairan: String
  - jenis: String
}

' Inheritance / Generalization
User <|-- Dosen
User <|-- Admin

' Relationships
Dosen "1" *-- "0..*" ChatSession : memiliki >
ChatSession "1" *-- "1..*" Message : berisi >
Dosen "1" *-- "0..*" Dokumen : mengupload >
Message "0..*" o-- "0..1" Dokumen : mereferensikan >
Dosen "1" *-- "0..*" JadwalMengajar : memiliki >
Dosen "1" -- "0..*" DataKeuanganPenelitian : terkait data AISnet >

' Privacy Constraint Note
note "Constraint Privasi:\nAdmin mengelola data akun & akses sistem,\nnamun TIDAK memiliki relasi atau hak akses\nke isi/file Dokumen milik Dosen." as N1
Admin .. N1
Dokumen .. N1

@enduml
```
