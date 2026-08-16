"use client";

import { MenuData } from "@/lib/types";
import { toast } from "@heroui/react";
import { useState } from "react";
import PortalLayout from "../../(portal)/layout";
import MenusLoading from "./MenusLoading";
import Header from "./components/Header";
import MenuTable from "./components/MenuTable";
import MenuFormModal from "./components/MenuFormModal";
import type { MenuFormState } from "./components/MenuFormModal";
import DeleteModal from "./components/DeleteModal";
import { useMenuServices } from "./hooks/useMenuServices";

const EMPTY_FORM: MenuFormState = {
  title: "",
  description: "",
  icon: "Monitor",
  href: "",
  visibleToRoles: ["admin", "dosen"],
  order: 1,
};

export default function AdminMenusPage() {
  const { menus, isLoading, createMutation, updateMutation, deleteMutation, handleMove } =
    useMenuServices();

  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuData | null>(null);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const setField = <K extends keyof MenuFormState>(key: K, value: MenuFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleOpenAdd = () => {
    setSelectedMenu(null);
    setForm({
      ...EMPTY_FORM,
      order: menus.length > 0 ? Math.max(...menus.map((m) => m.order ?? 0)) + 1 : 1,
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
    if (!form.title || !form.description || !form.href) {
      toast("Semua kolom wajib diisi.", { variant: "danger" });
      return;
    }

    if (selectedMenu?.id) {
      updateMutation.mutate(
        { id: selectedMenu.id, values: form },
        { onSuccess: () => setIsFormOpen(false) },
      );
    } else {
      createMutation.mutate(form, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <MenusLoading />
      </PortalLayout>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        <Header onAdd={handleOpenAdd} />
        <MenuTable
          menus={menus}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
          onMove={handleMove}
        />
      </div>

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
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onDelete={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </PortalLayout>
  );
}
