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
      
      {/* Fixed Floating Elements */}
      <ProfileFab />
      <AiFab onClick={() => setIsAiOpen(true)} />
      
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}
