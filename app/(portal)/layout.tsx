'use client';

import React, { useState } from 'react';
import ProfileFab from '../components/portal/ProfileFab';
import AiFab from '../components/portal/AiFab';
import AiAssistantModal from '../components/ai/AiAssistantModal';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-16 flex flex-col items-center">
        {children}
      </main>

      <div className='flex absolute right-8 bottom-8 flex-col gap-4'>
        <ProfileFab />
        <AiFab onClick={() => setIsAiOpen(true)} />
      </div>

      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
