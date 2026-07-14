```
@startuml
title Sequence Diagram Mengelola Menu Portal

autonumber
skinparam shadowing false

actor "Admin / USI" as Admin
boundary "Portal Web" as Web
control "Backend API" as API
control "Authorization Service" as Auth
database "PostgreSQL" as DB
control "Audit Log Service" as Log

Admin -> Web : Membuka panel admin
Admin -> Web : Memilih pengelolaan menu
Web -> API : Meminta daftar seluruh menu
API -> Auth : Validasi session dan role ADMIN
Auth --> API : Hak akses valid
API -> DB : Ambil seluruh menu portal
DB --> API : Daftar menu
API --> Web : Daftar menu portal
Web --> Admin : Menampilkan pengelolaan menu

alt Menambahkan menu

    Admin -> Web : Mengisi judul, deskripsi,\nURL, dan urutan
    Web -> API : Mengirim data menu baru
    API -> DB : Simpan PortalMenu
    DB --> API : Menu berhasil ditambahkan
    API -> Log : Catat CREATE_PORTAL_MENU

else Mengubah menu

    Admin -> Web : Mengubah data menu
    Web -> API : Mengirim perubahan
    API -> DB : Perbarui PortalMenu
    DB --> API : Menu berhasil diperbarui
    API -> Log : Catat UPDATE_PORTAL_MENU

else Mengatur urutan menu

    Admin -> Web : Mengubah posisi menu
    Web -> API : Mengirim urutan terbaru
    API -> DB : Perbarui field order
    DB --> API : Urutan berhasil diperbarui
    API -> Log : Catat REORDER_PORTAL_MENU

else Mengaktifkan atau menonaktifkan menu

    Admin -> Web : Mengubah status menu
    Web -> API : Mengirim isActive terbaru
    API -> DB : Perbarui status menu
    DB --> API : Status berhasil diperbarui
    API -> Log : Catat TOGGLE_PORTAL_MENU

else Menghapus menu

    Admin -> Web : Memilih hapus menu
    Web --> Admin : Menampilkan konfirmasi
    Admin -> Web : Mengonfirmasi penghapusan
    Web -> API : Permintaan hapus menu
    API -> DB : Hapus PortalMenu
    DB --> API : Menu berhasil dihapus
    API -> Log : Catat DELETE_PORTAL_MENU

end

Log --> API : Audit log tersimpan
API --> Web : Operasi berhasil
Web --> Admin : Menampilkan hasil operasi

@enduml
```
