"use client";

import { CreateUserInput, Role } from "@/lib/types";
import {
  Alert,
  Button,
  Input,
  Label,
  Modal,
  Radio,
  RadioGroup,
  Spinner,
  TextField,
} from "@heroui/react";
import { Info, Key, ShieldCheck, UserCheck } from "@phosphor-icons/react";

interface UserFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreateUserInput;
  onFormChange: <K extends keyof CreateUserInput>(
    key: K,
    value: CreateUserInput[K],
  ) => void;
  onSave: () => void;
  isPending: boolean;
}

export default function UserFormModal({
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  onSave,
  isPending,
}: UserFormModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl outline-none">
            <Modal.Header>
              <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                Tambah Akun User Baru
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="gap-4 mt-4 space-y-4">
              <TextField
                value={form.name}
                onChange={(val) => onFormChange("name", val)}
                isRequired
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Nama Lengkap
                </Label>
                <Input
                  placeholder="Contoh: Dr. Budi Raharja, M.Kom."
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>

              <TextField
                value={form.email}
                onChange={(val) => onFormChange("email", val)}
                isRequired
                type="email"
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs text-neutral-500 font-medium">
                  Email
                </Label>
                <Input
                  placeholder="budi@itg.ac.id"
                  className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                />
              </TextField>

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-neutral-500 font-medium">
                  Peran / Hak Akses (Role)
                </Label>
                <RadioGroup
                  value={form.role}
                  onChange={(val) => onFormChange("role", val as Role)}
                  className="flex flex-row gap-4"
                >
                  <Radio
                    value="dosen"
                    className="flex items-center gap-2 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors flex-1"
                  >
                    <Radio.Control />
                    <Radio.Content>
                      <div className="flex items-center gap-1.5">
                        <UserCheck size={16} />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Dosen
                        </span>
                      </div>
                    </Radio.Content>
                  </Radio>
                  <Radio
                    value="admin"
                    className="flex items-center gap-2 p-3 border border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors flex-1"
                  >
                    <Radio.Control />
                    <Radio.Content>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Admin
                        </span>
                      </div>
                    </Radio.Content>
                  </Radio>
                </RadioGroup>
              </div>

              {/* Password info alert */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 flex items-start gap-2.5">
                <Key size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Password awal otomatis diset ke:{" "}
                  <strong className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-900 dark:text-white">
                    password123
                  </strong>
                  . Pengguna dapat memperbarui password setelah masuk ke portal.
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
                {isPending && <Spinner size="sm" className="mr-2" />}
                Simpan User
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
