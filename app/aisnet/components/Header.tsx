"use client";

import { fallbackUser } from "@/constants";
import { useLogout, useSession } from "@/lib/auth-client";
import { Breadcrumbs, Button, Chip, Popover } from "@heroui/react";
import { BellIcon, SignOutIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useSession();
  const logout = useLogout();
  const router = useRouter();

  const userName = user?.name || fallbackUser.name;
  const userRole = user?.role || fallbackUser.role;
  const userImage = user?.image || fallbackUser.image;

  const handleLogout = async () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <header className="flex justify-between fixed h-[65px] left-[265px] right-0 bg-white border-b border-neutral-200">
      <div className="flex justify-between w-full px-8">
        <div className="flex items-center" />

        <div className="flex flex-1 justify-between">
          <Breadcrumbs>
            <Breadcrumbs.Item href="/" isDisabled>
              Keuangan
            </Breadcrumbs.Item>
            <Breadcrumbs.Item href="/aisnet">
              Penelitian dan PkM
            </Breadcrumbs.Item>
          </Breadcrumbs>

          {/* User controls */}
          <div className="flex shrink-0 items-center gap-3">
            <Button variant="ghost" isIconOnly>
              <span className="flex items-center justify-center">
                <BellIcon size={20} />
              </span>
            </Button>
            <div>
              <Popover>
                <Popover.Trigger>
                  <div className="flex flex-col">
                    <span className="flex items-center font-semibold capitalize text-[15px] leading-tight text-neutral-800">
                      {userName}
                    </span>
                    <span className="font-medium capitalize text-neutral-400 text-xs leading-none">
                      {userRole}
                    </span>
                  </div>
                </Popover.Trigger>

                <Popover.Content className={"max-w-64"}>
                  <Popover.Dialog className="space-y-3 flex flex-col">
                    <div className="flex gap-3">
                      <Image
                        src={userImage}
                        alt="user-image"
                        width={40}
                        height={40}
                        className="rounded-full w-12 aspect-square object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold">{userName}</p>
                        <Chip variant="secondary" className="w-fit">
                          {userRole}
                        </Chip>
                      </div>
                    </div>
                    <Button
                      variant="danger-soft"
                      fullWidth
                      onClick={handleLogout}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Keluar
                        <SignOutIcon size={20} />
                      </span>
                    </Button>
                  </Popover.Dialog>
                </Popover.Content>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
