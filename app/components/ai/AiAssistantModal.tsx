"use client";

import { Research } from "@/lib/types";
import { Modal } from "@heroui/react";
import { useSession } from "../../../lib/auth-client";
import Chatbot from "../Chatbot";
import LoginForm from "../portal/LoginForm";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableData?: Research[];
}

export default function AiAssistantModal({
  isOpen,
  onClose,
  tableData,
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
          <Modal.Dialog className="border border-neutral-100 dark:border-neutral-800 flex flex-col outline-none relative overflow-hidden">
            {/* <Modal.CloseTrigger /> */}

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
                <div className="flex items-center justify-center h-full">
                  <LoginForm onSuccess={onClose} />
                </div>
              ) : (
                <Chatbot tableData={tableData} />
              )}
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
