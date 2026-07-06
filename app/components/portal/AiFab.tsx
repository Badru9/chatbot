'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { RobotIcon } from '@phosphor-icons/react';

interface AiFabProps {
  onClick: () => void;
}

export default function AiFab({ onClick }: AiFabProps) {
  return (
    <div>
      <Button
        isIconOnly
        onClick={onClick}
        className="w-14 h-14 bg-neutral-900 text-white hover:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition active:scale-95"
        aria-label="Asisten AI"
      >
        <RobotIcon size={36} weight="fill" />
      </Button>
    </div>
  );
}
