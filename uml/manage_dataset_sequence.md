```
@startuml
title Sequence Diagram Mengelola Dataset Institusi

autonumber
skinparam shadowing false

actor "Admin / USI" as Admin
boundary "Portal Web" as Web
control "Backend API" as API
control "Authorization Service" as Auth
database "File Storage" as Storage
database "PostgreSQL dan pgvector" as DB
control "Dataset Processor" as Processor
control "BGE-M3" as Embedding
control "Audit Log Service" as Log

Admin -> Web : Membuka pengelolaan dataset
Web -> API : Meminta daftar dataset
API -> Auth : Validasi session dan role ADMIN
Auth --> API : Hak akses valid
API -> DB : Ambil dataset institusi
DB --> API : Daftar dataset dan status
API --> Web : Data dataset
Web --> Admin : Menampilkan daftar dataset

alt Menambahkan dataset PDF

    Admin -> Web : Memilih file PDF
    Web -> API : Mengunggah PDF institusi
    API -> Storage : Menyimpan file
    Storage --> API : Lokasi file
    API -> DB : Simpan Document\nscope INSTITUTIONAL\nstatus PROCESSING
    API -> Processor : Mulai pemrosesan PDF

    Processor -> Storage : Membaca PDF
    Storage --> Processor : File PDF
    Processor -> Processor : Ekstraksi teks dan chunking

    loop Setiap chunk
        Processor -> Embedding : Membuat embedding
        Embedding --> Processor : Vector embedding
        Processor -> DB : Simpan chunk dan embedding
    end

else Menambahkan data tanya jawab

    Admin -> Web : Mengisi pertanyaan dan jawaban
    Web -> API : Mengirim data tanya jawab
    API -> DB : Simpan InstitutionalQA
    API -> Processor : Proses teks tanya jawab
    Processor -> Embedding : Membuat embedding
    Embedding --> Processor : Vector embedding
    Processor -> DB : Simpan embedding dataset

else Memperbarui dataset

    Admin -> Web : Mengubah atau mengganti dataset
    Web -> API : Mengirim data terbaru
    API -> DB : Perbarui metadata dan\nstatus PROCESSING
    API -> Processor : Memproses ulang dataset

else Mengaktifkan atau menonaktifkan dataset

    Admin -> Web : Mengubah status dataset
    Web -> API : Mengirim isActive terbaru
    API -> DB : Perbarui isActive

else Memproses ulang dataset

    Admin -> Web : Memilih proses ulang
    Web -> API : Meminta reprocessing
    API -> DB : Ubah status menjadi PROCESSING
    API -> Processor : Jalankan pemrosesan ulang

else Menghapus dataset

    Admin -> Web : Memilih hapus dataset
    Web --> Admin : Menampilkan konfirmasi
    Admin -> Web : Mengonfirmasi penghapusan
    Web -> API : Permintaan hapus dataset
    API -> DB : Hapus dataset dan chunk
    API -> Storage : Hapus file jika tersedia

end

alt Pemrosesan berhasil

    Processor -> DB : Ubah status menjadi COMPLETED
    Processor -> Log : Catat pemrosesan berhasil

else Pemrosesan gagal

    Processor -> DB : Ubah status menjadi FAILED
    Processor -> DB : Simpan errorMessage
    Processor -> Log : Catat kegagalan pemrosesan

end

API -> Log : Catat aktivitas pengelolaan dataset
Log --> API : Audit log tersimpan
API --> Web : Status operasi
Web --> Admin : Menampilkan status atau pesan kesalahan

@enduml
```
