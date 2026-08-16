"use client";

import { Avatar, Button } from "@heroui/react";
import { BellIcon } from "@phosphor-icons/react";
import { useSession } from "@/lib/auth-client";

export default function Header() {
  const { user } = useSession();

  console.log("user", user);

  const userName = user?.name || "leni fitriani";
  const userRole = user?.role || "dosen";
  const userImage =
    user?.image || "https://api-aisnet.itg.ac.id/uploads/foto/F1669432653.png";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex justify-between fixed h-[65px] left-[265px] right-0 bg-white border-b border-neutral-200">
      <div className="flex justify-between w-full px-8">
        <div className="flex items-center" />

        <div className="flex flex-1 justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center">
            <div className="flex items-center flex-wrap gap-2 text-sm">
              <h1 className="font-semibold text-neutral-900">Keuangan</h1>
              <span className="text-neutral-300">/</span>
              <span className="text-neutral-500">Penelitian dan PkM</span>
            </div>
          </div>

          {/* User controls */}
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="ghost"
              className="flex items-center justify-center w-10 h-10 min-w-0 p-0 bg-transparent rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 border-none"
            >
              <span className="flex items-center justify-center">
                <BellIcon size={20} />
              </span>
            </Button>

            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 rounded-sm">
                {userImage ? (
                  <Avatar.Image alt={userName} src={userImage} />
                ) : null}
                <Avatar.Fallback className="rounded-sm bg-neutral-200 text-neutral-700">
                  {getInitials(userName)}
                </Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="flex items-center font-semibold capitalize text-[15px] leading-tight text-neutral-800">
                  {userName}
                </span>
                <span className="font-medium capitalize text-neutral-400 text-xs leading-none">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
