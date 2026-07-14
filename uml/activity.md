```plantuml
@startuml
title Activity Diagram Portal Dosen dengan Chatbot Personal

skinparam shadowing false
skinparam activity {
BackgroundColor White
BorderColor Black
ArrowColor Black
DiamondBackgroundColor White
DiamondBorderColor Black
}

start

|Portal Web|
:Menampilkan halaman portal;

|Backend dan Database|
:Mengambil menu portal aktif\nberdasarkan urutan;

|Portal Web|
:Menampilkan daftar platform;

if (Pengguna membuka\nplatform eksternal?) then (Ya)
|Dosen|
:Memilih platform;

    |Portal Web|
    :Membuka tautan pada tab baru;

    |Dosen|
    :Mengakses platform eksternal;

else (Tidak)
endif

|Portal Web|
if (Pengguna membutuhkan\nfitur personal?) then (Ya)

    :Menampilkan halaman login;

    if (Login sebagai?) then (Dosen)

        |Dosen|
        :Memasukkan email dan password;

    else (Admin)

        |Admin / USI|
        :Memasukkan email dan password;
    endif

    |Portal Web|
    :Mengirim kredensial;

    |Backend dan Database|
    :Memvalidasi kredensial,\nstatus akun, dan role;

    if (Login valid?) then (Tidak)

        |Portal Web|
        :Menampilkan pesan login gagal;

        stop

    else (Ya)

        |Backend dan Database|
        :Membuat session pengguna;
        :Mencatat aktivitas login;

        if (Role pengguna?) then (Dosen)

            |Portal Web|
            :Menampilkan halaman dosen;

            |Dosen|
            while (Masih menggunakan sistem?) is (Ya)

                :Memilih fitur dosen;

                if (Fitur yang dipilih?) then (Profil)

                    |Portal Web|
                    :Menampilkan data profil;

                    |Dosen|
                    :Melihat atau mengubah\nprofil sendiri;

                    |Backend dan Database|
                    :Memvalidasi kepemilikan akun;
                    :Memperbarui data profil;

                    |Portal Web|
                    :Menampilkan hasil perubahan;

                elseif (Dokumen)

                    |Portal Web|
                    :Menampilkan daftar dokumen;

                    |Backend dan Database|
                    :Mengambil dokumen\nberdasarkan ownerId;

                    |Portal Web|
                    :Menampilkan dokumen dan\nstatus pemrosesan;

                    |Dosen|
                    if (Menambahkan atau\nmemperbarui dokumen?) then (Ya)
                        :Memilih file PDF;

                        |Portal Web|
                        :Memvalidasi format awal PDF;

                        |Backend dan Database|
                        :Memvalidasi MIME type\ndan isi file;

                        if (PDF valid?) then (Tidak)

                            |Portal Web|
                            :Menampilkan pesan kesalahan\nyang mudah dipahami;

                        else (Ya)

                            |Backend dan Database|
                            :Menyimpan metadata dokumen;
                            :Mengubah status menjadi PROCESSING;

                            |RAG-LLM|
                            :Mengekstrak teks PDF;
                            :Membagi teks menjadi chunk;
                            :Membuat embedding dengan BGE-M3;
                            :Menyimpan embedding ke pgvector;

                            if (Pemrosesan berhasil?) then (Ya)

                                |Backend dan Database|
                                :Mengubah status menjadi COMPLETED;

                            else (Tidak)

                                |Backend dan Database|
                                :Mengubah status menjadi FAILED;
                                :Menyimpan pesan kesalahan;
                            endif

                            |Portal Web|
                            :Menampilkan status pemrosesan;
                        endif
                    endif

                elseif (Chatbot)

                    |Portal Web|
                    :Menampilkan halaman chatbot;

                    |Backend dan Database|
                    :Mengambil dokumen COMPLETED\nmilik dosen;

                    |Portal Web|
                    :Menampilkan pilihan dokumen;

                    |Dosen|
                    :Memilih dokumen sumber;
                    :Menulis pertanyaan;

                    |Backend dan Database|
                    :Memvalidasi kepemilikan dokumen;

                    if (Dokumen valid dan\nmilik dosen?) then (Tidak)

                        |Portal Web|
                        :Menampilkan pesan akses ditolak;

                    else (Ya)

                        |Backend dan Database|
                        :Menyimpan pesan dosen;
                        :Memuat konteks percakapan;

                        |RAG-LLM|
                        :Membuat embedding pertanyaan;
                        :Mengidentifikasi jenis pertanyaan;

                        if (Jenis pertanyaan?) then (Personal / Mata Kuliah)
                            :Mencari chunk pada\ndokumen pribadi terpilih;
                        else (Kebijakan Institusi)
                            :Mencari informasi pada\ndataset institusi;
                        endif

                        if (Konteks relevan ditemukan?) then (Ya)

                            :Menyusun prompt berdasarkan\nkonteks dan riwayat;
                            :Menghasilkan jawaban dengan\nQwen melalui Ollama;

                            |Backend dan Database|
                            :Menyimpan jawaban dan\nnama dokumen sumber;

                            |Portal Web|
                            :Menampilkan jawaban dan sumber;

                        else (Tidak)

                            |RAG-LLM|
                            :Menghasilkan jawaban umum\ndengan Qwen melalui Ollama;

                            |Backend dan Database|
                            :Menyimpan jawaban umum;
                            :Menandai isGeneralAnswer = true;

                            |Portal Web|
                            :Menampilkan jawaban umum dan\nperingatan tidak berasal dari dokumen;
                        endif

                        |Dosen|
                        :Membaca, menyalin, mengirim ulang,\natau menghapus pesan;
                    endif

                else (Riwayat Percakapan)

                    |Backend dan Database|
                    :Mengambil riwayat percakapan;

                    |Portal Web|
                    :Menampilkan daftar percakapan;

                    |Dosen|
                    :Melanjutkan percakapan,\nmengubah judul, atau menghapus;

                    |Backend dan Database|
                    :Memperbarui riwayat percakapan;
                endif

            endwhile (Tidak)

            |Backend dan Database|
            :Mengakhiri session;

            |Dosen|
            :Logout;

        else (Admin)

            |Portal Web|
            :Menampilkan portal dan modal admin;

            |Admin / USI|
            while (Masih menggunakan panel admin?) is (Ya)

                :Memilih fitur admin;

                if (Fitur yang dipilih?) then (Akun Dosen)

                    :Menambah, mengaktifkan,\nmenonaktifkan, mereset password,\natau menghapus akun;

                    |Backend dan Database|
                    :Memproses perubahan akun;
                    :Mencatat audit log;

                elseif (Menu Portal)

                    |Admin / USI|
                    :Menambah, mengubah, mengurutkan,\nmengaktifkan, atau menghapus menu;

                    |Backend dan Database|
                    :Memperbarui menu portal;
                    :Mencatat audit log;

                elseif (Dataset Institusi)

                    |Admin / USI|
                    :Menambah atau memperbarui\nPDF maupun data tanya jawab;

                    |Backend dan Database|
                    :Menyimpan dataset;
                    :Mengubah status menjadi PROCESSING;

                    |RAG-LLM|
                    :Mengekstrak atau memproses teks;
                    :Membuat embedding dengan BGE-M3;
                    :Menyimpan embedding ke pgvector;

                    if (Pemrosesan berhasil?) then (Ya)

                        |Backend dan Database|
                        :Mengubah status menjadi COMPLETED;

                    else (Tidak)

                        |Backend dan Database|
                        :Mengubah status menjadi FAILED;
                        :Menyimpan pesan kesalahan;
                    endif

                    :Mencatat audit log;

                elseif (Metadata Dokumen)

                    |Backend dan Database|
                    :Mengambil metadata dokumen dosen;

                    |Portal Web|
                    :Menampilkan metadata tanpa isi dokumen;

                else (Audit Log)

                    |Backend dan Database|
                    :Mengambil log aktivitas;

                    |Portal Web|
                    :Menampilkan audit log;
                endif

                |Admin / USI|

            endwhile (Tidak)

            |Backend dan Database|
            :Mengakhiri session;

            |Admin / USI|
            :Logout;
        endif
    endif

else (Tidak)

    |Dosen|
    :Menggunakan portal tanpa login;

endif

stop
@enduml
```
