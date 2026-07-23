"use client";

import { Button, Input, Label, Modal } from "@heroui/react";
import type { ChangeEvent } from "react";

interface UploadFileModalProps {
  file: File | null;
  isOpen: boolean;
  isUploading: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

export default function UploadFileModal({
  file,
  isOpen,
  isUploading,
  onCancel,
  onFileChange,
  onOpenChange,
  onSubmit,
}: UploadFileModalProps) {
  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isUploading ? false : true}
    >
      <Modal.Container placement="center" size="sm">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Upload PDF</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pdf-upload">File PDF</Label>
              <Input
                accept="application/pdf,.pdf"
                id="pdf-upload"
                disabled={isUploading}
                type="file"
                variant="secondary"
                onChange={onFileChange}
              />
              {file ? (
                <p className="text-sm text-muted">
                  Terpilih: {file.name} · {formatBytes(file.size)}
                </p>
              ) : null}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              slot="close"
              isDisabled={isUploading}
              variant="secondary"
              onPress={onCancel}
            >
              Batal
            </Button>
            <Button isDisabled={!file || isUploading} onPress={onSubmit}>
              {isUploading ? "Memproses..." : "Tambahkan"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
