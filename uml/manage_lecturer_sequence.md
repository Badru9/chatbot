```
@startuml
title Sequence Diagram Mengelola Akun Dosen

autonumber
skinparam shadowing false

actor "Admin / USI" as Admin
boundary "Portal Web" as Web
control "Backend API" as API
control "Authentication Service" as Auth
database "PostgreSQL" as DB
control "Audit Log Service" as Log

Admin -> Web : Membuka pengelolaan akun
Web -> API : Meminta daftar akun dosen
API -> Auth : Validasi session dan role ADMIN
Auth --> API : Hak akses valid
API -> DB : Ambil akun dengan role DOSEN
DB --> API : Daftar akun dosen
API --> Web : Daftar akun
Web --> Admin : Menampilkan daftar akun

alt Menambahkan akun dosen

    Admin -> Web : Mengisi NIDN/NIP, nama,\nprogram studi, email,\ndan password sementara
    Web -> API : Mengirim data akun
    API -> DB : Memeriksa keunikan email\ndan NIDN/NIP
    DB --> API : Hasil validasi

    alt Email atau NIDN/NIP telah digunakan

        API --> Web : Data akun telah terdaftar
        Web --> Admin : Menampilkan pesan kesalahan

    else Data tersedia

        API -> Auth : Membuat password hash
        Auth --> API : Password hash
        API -> DB : Simpan User role DOSEN
        API -> DB : Simpan Account
        DB --> API : Akun berhasil dibuat
        API -> Log : Catat CREATE_USER
        API --> Web : Akun berhasil ditambahkan
        Web --> Admin : Menampilkan konfirmasi
    end

else Mengaktifkan akun

    Admin -> Web : Memilih aktifkan akun
    Web -> API : userId dan isActive = true
    API -> DB : Perbarui status akun
    API -> Log : Catat ACTIVATE_USER
    API --> Web : Akun berhasil diaktifkan
    Web --> Admin : Menampilkan konfirmasi

else Menonaktifkan akun

    Admin -> Web : Memilih nonaktifkan akun
    Web -> API : userId dan isActive = false
    API -> DB : Perbarui status akun
    API -> DB : Hapus session aktif dosen
    API -> Log : Catat DEACTIVATE_USER
    API --> Web : Akun berhasil dinonaktifkan
    Web --> Admin : Menampilkan konfirmasi

else Menghapus akun

    Admin -> Web : Memilih hapus akun
    Web --> Admin : Menampilkan konfirmasi
    Admin -> Web : Mengonfirmasi penghapusan
    Web -> API : Permintaan hapus akun
    API -> DB : Memeriksa relasi akun
    DB --> API : Informasi relasi akun
    API -> Log : Simpan audit sebelum penghapusan
    API -> DB : Hapus akun dan session terkait
    DB --> API : Akun berhasil dihapus
    API --> Web : Penghapusan berhasil
    Web --> Admin : Menampilkan konfirmasi

end

@enduml
```
