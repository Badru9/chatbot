"use client";

import { useSession } from "@/lib/auth-client";
import { CreateUserInput, UserData } from "@/lib/types";
import { toast } from "@heroui/react";
import { useState } from "react";
import PortalLayout from "../../(portal)/layout";
import UsersLoading from "./UsersLoading";
import DeleteModal from "./components/DeleteModal";
import Header from "./components/Header";
import UserFormModal from "./components/UserFormModal";
import UserTable from "./components/UserTable";
import { useUserServices } from "./hooks/useUserServices";

const EMPTY_FORM: CreateUserInput = {
  name: "",
  email: "",
  role: "dosen",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useSession();
  const { users, isLoading, createMutation, deleteMutation } =
    useUserServices();

  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const setField = <K extends keyof CreateUserInput>(
    key: K,
    value: CreateUserInput[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleOpenAdd = () => {
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.role) {
      toast("Semua kolom wajib diisi.", { variant: "danger" });
      return;
    }

    createMutation.mutate(form, {
      onSuccess: () => {
        toast("Akun user berhasil ditambahkan!", { variant: "success" });
        setIsFormOpen(false);
      },
      onError: (err) => {
        toast(err.message || "Gagal menambahkan user.", { variant: "danger" });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteTarget?.id) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast("Akun user berhasil dihapus.", { variant: "success" });
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast(err.message || "Gagal menghapus user.", { variant: "danger" });
      },
    });
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <UsersLoading />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        <Header onAdd={handleOpenAdd} />
        <UserTable
          users={users}
          onDelete={setDeleteTarget}
          currentUserId={currentUser?.id}
        />
      </div>

      <UserFormModal
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        form={form}
        onFormChange={setField}
        onSave={handleSave}
        isPending={createMutation.isPending}
      />

      <DeleteModal
        deleteTarget={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onDelete={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </PortalLayout>
  );
}
