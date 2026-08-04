"use client";

import { Button, Modal, Spinner } from "@heroui/react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm?: () => void | Promise<void>;
  isLoading?: boolean;
};

export default function DeleteModal({
  isOpen,
  onOpenChange,
  description,
  title,
  onConfirm,
  isLoading = false,
}: Props) {
  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isLoading}
    >
      <Modal.Container placement="center" size="sm">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {description}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              slot="close"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              isDisabled={isLoading}
            >
              {isLoading ? <Spinner color="current" /> : "Hapus"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

