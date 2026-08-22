"use client";

import { useDatasetServices } from "@/hooks/useDatasetServices";
import type { DatasetItem } from "@/services/datasetService";
import { toast } from "@heroui/react";
import { useState } from "react";
import PortalLayout from "../../(portal)/layout";
import Header from "./components/Header";
import Stats from "./components/Stats";
import DatasetTable from "./components/DatasetTable";
import {
  DatasetFormModal,
  DatasetPreviewModal,
  DeleteDatasetModal,
} from "./components/Modals";

const PEDOMAN_TEMPLATE_CONTENT = `# Pedoman Penulisan dan Pengajuan Skripsi 2026

## 1. Tujuan Penggunaan
Rujukan resmi saat mahasiswa atau dosen bertanya mengenai syarat, alur pendaftaran, format penulisan, dan tenggat waktu pengajuan tugas akhir/skripsi.

---

## 2. Syarat Pengajuan Judul Skripsi
1. Mahasiswa terdaftar aktif pada semester berjalan (minimal semester 7).
2. Telah menyelesaikan minimal 110 SKS dengan IPK Kumulatif minimal 3.00.
3. Telah lulus mata kuliah **Metode Penelitian** dengan nilai minimal B.
4. Tidak memiliki nilai E pada transkrip akademik.

---

## 3. Alur dan Prosedur Pendaftaran
1. **Konsultasi Awal**: Mahasiswa melakukan diskusi topik bersama Dosen Wali.
2. **Pengajuan Proposal**: Mengunggah ringkasan proposal 3 halaman ke sistem portal akademik.
3. **Verifikasi Koordinator**: Koordinator Skripsi meninjau kelayakan topik dalam kurun waktu 3 hari kerja.
4. **Penetapan Pembimbing**: Surat Keputusan Pembimbing diterbitkan oleh Program Studi.

---

## 4. Pertanyaan Umum (FAQ)
- **Berapa lama masa berlaku SK Pembimbing?**
  Masa berlaku SK Pembimbing adalah 6 bulan (1 semester) dan dapat diperpanjang 1 kali atas persetujuan Ketua Program Studi.
- **Bagaimana jika ingin melakukan perubahan judul?**
  Perubahan judul dapat diajukan dengan persetujuan kedua Dosen Pembimbing melalui formulir perubahan judul di portal admin.`;

const DOSEN_TEMPLATE_CONTENT = `[
  {
    "nama": "Dr. Eko Prasetyo, M.T.",
    "nidn": "0415088201",
    "prodi": "Teknik Informatika",
    "status": "Aktif",
    "jabatan_fungsional": "Lektor Kepala",
    "bidang_keahlian": ["Cyber Security", "Network Engineering", "Cloud Computing"],
    "tujuan_penggunaan": "Referensi bimbingan skripsi dan konsultasi riset bidang keamanan jaringan.",
    "kontak": "eko.prasetyo@univ.ac.id"
  },
  {
    "nama": "Dr. Siti Nurhaliza, M.Kom.",
    "nidn": "0422038502",
    "prodi": "Teknik Informatika",
    "status": "Aktif",
    "jabatan_fungsional": "Lektor",
    "bidang_keahlian": ["Artificial Intelligence", "Machine Learning", "NLP"],
    "tujuan_penggunaan": "Referensi bimbingan skripsi dan penguji topik AI/Data Science.",
    "kontak": "siti.nurhaliza@univ.ac.id"
  }
]`;

export default function DatasetsPage() {
  const {
    datasetsQuery,
    createDatasetMutation,
    updateDatasetMutation,
    toggleStatusMutation,
    deleteDatasetMutation,
  } = useDatasetServices();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [previewTarget, setPreviewTarget] = useState<DatasetItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DatasetItem | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [isActive, setIsActive] = useState(true);

  const totalDatasets = datasetsQuery.data?.length ?? 0;
  const activeDatasets =
    datasetsQuery.data?.filter((d) => d.isActive).length ?? 0;

  // -- Handlers --

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setDescription("");
    setContent("");
    setSource("");
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (dataset: DatasetItem) => {
    setIsEditing(true);
    setEditId(dataset.id);
    setName(dataset.name);
    setDescription(dataset.description || "");
    setContent(dataset.content);
    setSource(dataset.source || "");
    setIsActive(dataset.isActive);
    setIsFormOpen(true);
  };

  const handleApplyTemplate = (templateType: "pedoman" | "dosen") => {
    if (templateType === "pedoman") {
      setName("Pedoman Penulisan Skripsi & Tugas Akhir 2026");
      setDescription("Aturan syarat SKS, alur pengajuan, dan FAQ bimbingan skripsi");
      setSource("Buku Pedoman Akademik Fakultas 2026");
      setContent(PEDOMAN_TEMPLATE_CONTENT);
      setIsActive(true);
    } else {
      setName("Daftar Dosen & Keahlian Bimbingan Skripsi");
      setDescription("Data profil dosen, NIDN, bidang keahlian, dan kontak");
      setSource("Database Akademik Program Studi");
      setContent(DOSEN_TEMPLATE_CONTENT);
      setIsActive(true);
    }
    toast("Template berhasil dimuat ke formulir.", { variant: "success" });
  };

  const handleFormSubmit = () => {
    if (!name.trim() || !content.trim()) {
      toast("Nama dataset dan konten wajib diisi.", { variant: "danger" });
      return;
    }

    if (isEditing && editId) {
      updateDatasetMutation.mutate(
        {
          id: editId,
          payload: {
            name: name.trim(),
            description: description.trim() || undefined,
            content: content.trim(),
            source: source.trim() || undefined,
            isActive,
          },
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast("Dataset berhasil diperbarui.", { variant: "success" });
          },
          onError: (err: Error) => {
            toast(`Gagal memperbarui dataset: ${err.message}`, {
              variant: "danger",
            });
          },
        },
      );
    } else {
      createDatasetMutation.mutate(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          content: content.trim(),
          source: source.trim() || undefined,
          isActive,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            toast("Dataset baru berhasil ditambahkan.", { variant: "success" });
          },
          onError: (err: Error) => {
            toast(`Gagal menambahkan dataset: ${err.message}`, {
              variant: "danger",
            });
          },
        },
      );
    }
  };

  const handleToggleStatus = (dataset: DatasetItem, newStatus: boolean) => {
    toggleStatusMutation.mutate(
      { id: dataset.id, isActive: newStatus },
      {
        onSuccess: () => {
          toast(
            `Dataset ${dataset.name} kini ${newStatus ? "Aktif" : "Nonaktif"}.`,
            { variant: "success" },
          );
        },
        onError: (err: Error) => {
          toast(`Gagal mengubah status: ${err.message}`, { variant: "danger" });
        },
      },
    );
  };

  const handleDeleteSubmit = () => {
    if (!deleteTarget) return;
    deleteDatasetMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast("Dataset berhasil dihapus.", { variant: "success" });
      },
      onError: (err: Error) => {
        toast(`Gagal menghapus dataset: ${err.message}`, { variant: "danger" });
      },
    });
  };

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        <Header onOpenCreateModal={handleOpenCreateModal} />

        <Stats
          totalDatasets={totalDatasets}
          activeDatasets={activeDatasets}
          isLoading={datasetsQuery.isLoading}
        />

        <DatasetTable
          datasets={datasetsQuery.data}
          isLoading={datasetsQuery.isLoading}
          onPreview={(ds) => setPreviewTarget(ds)}
          onEdit={handleOpenEditModal}
          onDelete={(ds) => setDeleteTarget(ds)}
          onToggleStatus={handleToggleStatus}
        />

        {/* Create / Edit Modal */}
        <DatasetFormModal
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          isEditing={isEditing}
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
          content={content}
          onContentChange={setContent}
          source={source}
          onSourceChange={setSource}
          isActive={isActive}
          onIsActiveChange={setIsActive}
          onApplyTemplate={handleApplyTemplate}
          onSubmit={handleFormSubmit}
          isPending={
            createDatasetMutation.isPending || updateDatasetMutation.isPending
          }
        />

        {/* Preview Modal */}
        <DatasetPreviewModal
          previewTarget={previewTarget}
          onOpenChange={(open) => !open && setPreviewTarget(null)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteDatasetModal
          deleteTarget={deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          onSubmit={handleDeleteSubmit}
          isPending={deleteDatasetMutation.isPending}
        />
      </div>
    </PortalLayout>
  );
}
