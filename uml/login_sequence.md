@startuml
title Sequence Diagram Login

autonumber
skinparam shadowing false
skinparam sequence {
ParticipantBackgroundColor White
ParticipantBorderColor Black
ActorBackgroundColor White
ActorBorderColor Black
LifeLineBorderColor Black
ArrowColor Black
}

actor "Dosen atau Admin" as User
boundary "Portal Web" as Web
control "Backend API" as API
control "Authentication Service" as Auth
database "PostgreSQL" as DB
control "Audit Log Service" as Log

User -> Web : Membuka halaman login
Web --> User : Menampilkan form login

User -> Web : Memasukkan email dan password
Web -> API : Mengirim kredensial
API -> Auth : Memvalidasi kredensial
Auth -> DB : Mencari User dan Account\nberdasarkan email
DB --> Auth : Data akun, password hash,\nrole, dan status akun

alt Akun tidak ditemukan

    Auth --> API : Login gagal
    API -> Log : Catat percobaan login gagal
    Log --> API : Log tersimpan
    API --> Web : Email atau password tidak sesuai
    Web --> User : Menampilkan pesan kesalahan

else Akun tidak aktif

    Auth --> API : Akun dinonaktifkan
    API -> Log : Catat akses akun tidak aktif
    API --> Web : Akun sedang tidak aktif
    Web --> User : Menampilkan pesan akun tidak aktif

else Password tidak sesuai

    Auth --> API : Login gagal
    API -> Log : Catat percobaan login gagal
    API --> Web : Email atau password tidak sesuai
    Web --> User : Menampilkan pesan kesalahan

else Login berhasil

    Auth -> DB : Membuat session pengguna
    DB --> Auth : Session berhasil dibuat
    Auth --> API : Session dan role pengguna
    API -> Log : Catat login berhasil
    Log --> API : Log tersimpan

    alt Role DOSEN
        API --> Web : Session dosen
        Web --> User : Menampilkan halaman dosen
    else Role ADMIN
        API --> Web : Session admin
        Web --> User : Menampilkan portal dan panel admin
    end

end

@enduml
