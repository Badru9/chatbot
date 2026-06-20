'use client';

import React from 'react';
import { Modal } from '@heroui/react';
import Chatbot from '../Chatbot';
import LoginForm from '../portal/LoginForm';
import { useSession } from '../../../lib/auth-client';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiAssistantModal({ isOpen, onClose }: AiAssistantModalProps) {
  const { data: session, isPending } = useSession();

  return (
    <Modal.Backdrop 
      isOpen={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      variant="blur"
    >
      <Modal.Container placement="center" size="md" className="max-w-5xl h-[85vh] overflow-hidden">
        <Modal.Dialog className="p-0 h-full flex flex-col relative border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl">
          <Modal.CloseTrigger />
          <Modal.Body className="p-0 h-full overflow-hidden">
            {isPending ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-neutral-500 font-medium">Memuat data...</span>
              </div>
            ) : !session ? (
              <div className="flex items-center justify-center h-full p-8">
                <LoginForm onSuccess={onClose} />
              </div>
            ) : (
              <div className="h-full overflow-hidden">
                <Chatbot />
              </div>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
