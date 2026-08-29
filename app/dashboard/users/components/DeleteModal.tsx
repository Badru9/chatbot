"use client";

import { UserData } from "@/lib/types";
import { Button, Modal, Spinner } from "@heroui/react";

interface DeleteModalProps {
  deleteTarget: UserData | null;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isPending: boolean;
}

export default function DeleteModal({
  deleteTarget,
  onOpenChange,
  onDelete,
  isPending,
}: DeleteModalProps) {
  return (
    <Modal
      isOpen={deleteTarget !== null}
      onOpenChange={onOpenChange}
    >
      <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-99 flex items-center justify-center p-4">
        <Modal.Container>
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full outline-none">
            <Modal.Header>
              <Modal.Heading className="text-lg font-bold text-red-600 dark:text-red-500">
                Konfirmasi Hapus User
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Apakah Anda yakin ingin menghapus akun user{" "}
              <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})?
              Semua data terkait akun ini akan dihapus permanen.
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer px-4 py-2 text-sm rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={onDelete}
                isDisabled={isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl"
              >
                {isPending && <Spinner size="sm" className="mr-2" />}
                Hapus User
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
