@startuml
title Sequence Diagram Melihat dan Membuka Platform

autonumber
skinparam shadowing false

actor Dosen
boundary "Portal Web" as Web
control "Backend API" as API
database "PostgreSQL" as DB
participant "Platform Eksternal" as External

Dosen -> Web : Membuka portal
Web -> API : Meminta daftar menu portal
API -> DB : Ambil menu dengan isActive = true
DB --> API : Daftar menu berdasarkan order
API --> Web : Judul, deskripsi, dan URL
Web --> Dosen : Menampilkan daftar platform

Dosen -> Web : Memilih salah satu platform
Web -> Web : Memvalidasi URL menu
Web -> External : Membuka URL pada tab baru
External --> Dosen : Menampilkan platform eksternal

@enduml
