"use client";

import { MenuData } from "@/lib/types";
import type { MenuFormValues } from "@/services/menuApi";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Label,
  Modal,
  Spinner,
  TextArea,
  TextField,
} from "@heroui/react";

export interface MenuFormState {
  title: string;
  description: string;
  icon: string;
  href: string;
  visibleToRoles: string[];
  order: number;
}

interface MenuFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMenu: MenuData | null;
  form: MenuFormState;
  onFormChange: <K extends keyof MenuFormState>(
    key: K,
    value: MenuFormState[K],
  ) => void;
  onSave: () => void;
  isPending: boolean;
}

export default function MenuFormModal({
  isOpen,
  onOpenChange,
  editingMenu,
  form,
  onFormChange,
  onSave,
  isPending,
}: MenuFormModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl outline-none">
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                {editingMenu ? "Edit Menu Portal" : "Tambah Menu Portal Baru"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="gap-4 mt-4 space-y-3">
              <TextField
                value={form.title}
                onChange={(val) => onFormChange("title", val)}
                isRequired
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Judul Menu
                </Label>
                <Input
                  placeholder="Masukkan judul menu (misal: Portal SINTA)"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>
              <TextField
                value={form.description}
                onChange={(val) => onFormChange("description", val)}
                isRequired
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Deskripsi
                </Label>
                <TextArea
                  placeholder="Masukkan deskripsi singkat tentang kegunaan menu ini..."
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-20 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  value={form.href}
                  onChange={(val) => onFormChange("href", val)}
                  isRequired
                  className="w-full flex flex-col gap-1.5"
                >
                  <Label className="text-xs text-neutral-500 font-medium">
                    Link Navigasi (Href)
                  </Label>
                  <Input
                    placeholder="https://portal-sinta.kemdikbud.go.id/"
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <TextField
                  value={String(form.order)}
                  onChange={(val) => onFormChange("order", Number(val))}
                  className="w-full flex flex-col gap-1.5"
                >
                  <Label className="text-xs text-neutral-500 font-medium">
                    No. Urut (Order)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>
                <div className="flex flex-col gap-1.5 pl-1">
                  <span className="text-xs text-neutral-500 font-medium">
                    Akses Peran (Roles)
                  </span>
                  <CheckboxGroup
                    value={form.visibleToRoles}
                    onChange={(val) => onFormChange("visibleToRoles", val)}
                    className="flex flex-row gap-4"
                  >
                    <Checkbox value="admin">
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                      <Chip>admin</Chip>
                    </Checkbox>
                    <Checkbox value="dosen">
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                      <Chip>dosen</Chip>
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
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
                onClick={onSave}
                isDisabled={isPending}
                className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl"
              >
                {isPending && <Spinner size={"sm"} className="mr-2" />}
                Simpan
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
