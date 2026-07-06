"use client";

import { Button, Dropdown } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "../../../lib/auth-client";

export default function ProfileFab() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  if (!session) {
    return <></>;
  }

  const initial = session?.user?.name.charAt(0).toUpperCase();

  return (
    <div className="">
      <Dropdown>
        <Button
          isIconOnly
          className="w-14 h-14 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold text-lg rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
          aria-label="Profil"
        >
          {initial}
        </Button>
        <Dropdown.Popover placement="start bottom" className="shadow">
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "logout") {
                handleLogout();
              }
            }}
          >
            <Dropdown.Item id="profile" textValue="profile">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-neutral-900 dark:text-white leading-tight">
                  {session.user.name}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {session.user.role}
                </p>
              </div>
            </Dropdown.Item>
            {session.user.role === "admin" && (
              <Dropdown.Item id="admin-menus" textValue="admin-menus">
                <Link
                  href="/admin/menus"
                  className="w-full h-full block text-neutral-700 dark:text-neutral-300"
                >
                  Kelola Menu Portal
                </Link>
              </Dropdown.Item>
            )}
            {session.user.role === "admin" && (
              <Dropdown.Item id="admin-datasets" textValue="admin-datasets">
                <Link
                  href="/admin/datasets"
                  className="w-full h-full block text-neutral-700 dark:text-neutral-300"
                >
                  Kelola Dataset AI
                </Link>
              </Dropdown.Item>
            )}
            {session.user.role === "admin" && (
              <Dropdown.Item id="admin-users" textValue="admin-users">
                <Link
                  href="/admin/users"
                  className="w-full h-full block text-neutral-700 dark:text-neutral-300"
                >
                  Kelola Akun User
                </Link>
              </Dropdown.Item>
            )}
            <Dropdown.Item
              id="logout"
              textValue="logout"
              className="text-red-600 dark:text-red-400"
            >
              Keluar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
