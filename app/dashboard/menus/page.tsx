"use client";

import { MenuData } from "@/lib/types";
import { toast } from "@heroui/react";
import { useState } from "react";
import DeleteModal from "./components/DeleteModal";
import Header from "./components/Header";
import MenuFormModal, { MenuFormState } from "./components/MenuFormModal";
import MenuTable from "./components/MenuTable";
import { useMenuServices } from "./hooks/useMenuServices";
import MenusLoading from "./MenusLoading";

const EMPTY_FORM: MenuFormState = {
  title: "",
  description: "",
  icon: "Monitor",
  href: "",
  visibleToRoles: ["admin", "dosen"],
  order: 1,
};

export default function DashboardMenusPage() {
  const {
    menus,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    handleMove,
  } = useMenuServices();

  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuData | null>(null);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const setField = <K extends keyof MenuFormState>(
    key: K,
    value: MenuFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleOpenAdd = () => {
    setSelectedMenu(null);
    setForm({
      ...EMPTY_FORM,
      order:
        menus.length > 0 ? Math.max(...menus.map((m) => m.order ?? 0)) + 1 : 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (menu: MenuData) => {
    setSelectedMenu(menu);
    setForm({
      title: menu.title,
      description: menu.description,
      icon: menu.icon ?? "Monitor",
      href: menu.href,
      visibleToRoles: menu.visibleToRoles,
      order: menu.order ?? 1,
    });
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim() || !form.href.trim()) {
      toast("Semua kolom wajib diisi.", { variant: "danger" });
      return;
    }

    if (selectedMenu?.id) {
      updateMutation.mutate(
        { id: selectedMenu.id, values: form },
        {
          onSuccess: () => {
            toast("Menu portal berhasil diperbarui.", { variant: "success" });
            setIsFormOpen(false);
          },
          onError: (err: any) => {
            toast(`Gagal memperbarui menu: ${err.message}`, {
              variant: "danger",
            });
          },
        },
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toast("Menu portal baru berhasil ditambahkan.", {
            variant: "success",
          });
          setIsFormOpen(false);
        },
        onError: (err: any) => {
          toast(`Gagal menambahkan menu: ${err.message}`, {
            variant: "danger",
          });
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast("Menu portal berhasil dihapus.", { variant: "success" });
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        toast(`Gagal menghapus menu: ${err.message}`, { variant: "danger" });
      },
    });
  };

  if (isLoading) {
    return <MenusLoading />;
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="w-full flex flex-col gap-6">
      <Header onAdd={handleOpenAdd} totalCount={menus.length} />

      <MenuTable
        menus={menus}
        onEdit={handleOpenEdit}
        onDelete={setDeleteTarget}
        onMove={handleMove}
      />

      <MenuFormModal
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingMenu={selectedMenu}
        form={form}
        onFormChange={setField}
        onSave={handleSave}
        isPending={isPending}
      />

      <DeleteModal
        deleteTarget={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onDelete={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
