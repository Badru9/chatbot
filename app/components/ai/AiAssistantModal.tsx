"use client";

import React from "react";
import { Button, Modal } from "@heroui/react";
import { XIcon } from "@phosphor-icons/react";
import Chatbot from "../Chatbot";
import LoginForm from "../portal/LoginForm";
import { useSession } from "../../../lib/auth-client";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiAssistantModal({
  isOpen,
  onClose,
}: AiAssistantModalProps) {
  const { user, isPending } = useSession();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Backdrop>
        <Modal.Container size={!user ? "md" : "cover"} placement="center">
          <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col outline-none relative overflow-hidden shadow-2xl">
            <Button
              onClick={onClose}
              isIconOnly
              variant="ghost"
              className="absolute top-4 right-4 z-50"
              aria-label="Tutup asisten"
            >
              <XIcon size={18} />
            </Button>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              {isPending ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div className="w-8 h-8 border-3 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
                  <span className="text-neutral-500 text-sm font-medium">
                    Memuat data...
                  </span>
                </div>
              ) : !user ? (
                <div className="flex items-center justify-center h-full p-8">
                  <LoginForm onSuccess={onClose} />
                </div>
              ) : (
                <Chatbot />
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
