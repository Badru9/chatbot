# Sequence Diagram — Portal Dosen & Asisten Virtual (ITG)

Dokumen ini memuat tepat 3 Sequence Diagram untuk use case yang melibatkan interaksi signifikan antar komponen arsitektur backend (**Frontend/UI**, **API/Backend**, **AI Service**, dan **Database**).

---

## 1. Sequence Diagram: Chat dengan Asisten Virtual

### Penjelasan Diagram

Menggambarkan interaksi pengiriman pesan dari antarmuka ke backend, pengambilan dokumen referensi (_opt_) dari database, pemrosesan oleh AI Service, dan penyimpanan riwayat chat ke Database.

```plantuml
@startuml
title Sequence Diagram - Chat dengan Asisten Virtual

autonumber
skinparam responseMessageBelowArrow true
skinparam shadowing false

actor "Dosen" as User
boundary "Chat UI (Frontend)" as UI
control "Chat API (Backend)" as API
database "Database" as DB
participant "AI Service (LLM)" as AI

User -> UI : Kirim pesan & (opsional) pilih dokumen referensi
activate UI

UI -> API : POST /api/chat {sessionId, message, docId}
activate API

opt Dokumen dipilih sebagai konteks
  API -> DB : getDocumentById(docId, dosenId)
  activate DB
  DB --> API : documentContent
  deactivate DB
end

API -> DB : saveMessage(sessionId, 'user', message)
activate DB
DB --> API : messageSaved
deactivate DB

API -> AI : generateCompletion(systemPrompt, docContext, history, message)
activate AI
AI --> API : responseText
deactivate AI

API -> DB : saveMessage(sessionId, 'assistant', responseText)
activate DB
DB --> API : responseSaved
deactivate DB

API --> UI : 200 OK {reply: responseText}
deactivate API

UI --> User : Render balasan asisten virtual di layar
deactivate UI
@enduml
```

---

## 2. Sequence Diagram: Ekstrak Jadwal Mengajar dari PDF

### Penjelasan Diagram

Menggambarkan alur pengunggahan berkas PDF jadwal, ekstraksi struktur jadwal oleh AI Service, pembersihan data jadwal lama, penyimpanan entitas baru ke Database, dan pembaruan tampilan panel Jadwal Mengajar.

```plantuml
@startuml
title Sequence Diagram - Ekstrak Jadwal Mengajar dari PDF

autonumber
skinparam responseMessageBelowArrow true
skinparam shadowing false

actor "Dosen" as User
boundary "Jadwal UI (Frontend)" as UI
control "Jadwal API (Backend)" as API
participant "AI Service (Parser)" as AI
database "Database" as DB

User -> UI : Upload berkas PDF jadwal mengajar
activate UI

UI -> API : POST /api/jadwal/extract (FormData: pdfFile)
activate API

API -> API : validateFileFormatAndSize(pdfFile)

alt Berkas Tidak Valid
  API --> UI : 400 Bad Request (Pesan Error Validasi)
  UI --> User : Tampilkan pesan error berkas tidak valid
else Berkas Valid
  API -> AI : parseScheduleFromPDF(pdfBuffer)
  activate AI

  alt Gagal Parsing AI
    AI --> API : ParsingError / null
    API --> UI : 422 Unprocessable Entity (Gagal Ekstraksi AI)
    UI --> User : Tampilkan pesan gagal ekstraksi jadwal
  else Berhasil Parsing AI
    AI --> API : extractedScheduleData[]
    deactivate AI

    API -> DB : findExistingSchedule(dosenId)
    activate DB
    DB --> API : existingScheduleList
    deactivate DB

    opt Jadwal lama ada
      API -> DB : deleteScheduleByDosenId(dosenId)
      activate DB
      DB --> API : deleteSuccess
      deactivate DB
    end

    API -> DB : insertScheduleRecords(dosenId, extractedScheduleData)
    activate DB
    DB --> API : insertSuccess
    deactivate DB

    API --> UI : 200 OK {schedules: extractedScheduleData}
    deactivate API

    UI --> User : Tampilkan tabel jadwal pada Panel Jadwal Mengajar
  end
end
deactivate UI
@enduml
```

---

## 3. Sequence Diagram: Tanya Asisten AI tentang Data AISnet

### Penjelasan Diagram

Menggambarkan alur pengajuan pertanyaan dosen mengenai data tabel keuangan penelitian/PkM yang sedang aktif, di mana data tabel disematkan secara real-time ke AI Service tanpa proses upload berkas.

```plantuml
@startuml
title Sequence Diagram - Tanya Asisten AI tentang Data AISnet

autonumber
skinparam responseMessageBelowArrow true
skinparam shadowing false

actor "Dosen" as User
boundary "AISnet Table View" as View
boundary "AiAssistantModal" as Modal
control "AISnet AI API" as API
participant "AI Service (LLM)" as AI

User -> View : Buka halaman Data Keuangan Penelitian & PkM
activate View
View --> User : Tampilkan tabel data keuangan aktif

User -> Modal : Buka modal AI & ajukan pertanyaan terkait data tabel
activate Modal

Modal -> Modal : serializeCurrentTableData(activeRows)
Modal -> API : POST /api/aisnet/ask-ai {question, tableContextJSON}
activate API

API -> API : constructPrompt(question, tableContextJSON)
API -> AI : generateAnalysis(promptWithTableData)
activate AI
AI --> API : analysisResultText
deactivate AI

API --> Modal : 200 OK {answer: analysisResultText}
deactivate API

Modal --> User : Tampilkan hasil analisis data keuangan dari AI
deactivate Modal
deactivate View
@enduml
```
