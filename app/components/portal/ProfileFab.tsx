"use client";

import React, { useState } from "react";
import { Button, Modal, Dropdown } from "@heroui/react";
import { User } from "@phosphor-icons/react";
import { useSession, useLogout } from "../../../lib/auth-client";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function ProfileFab() {
  const { user } = useSession();
  const logoutMutation = useLogout();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  if (!user) {
    return (
      <>
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            isIconOnly
            onClick={() => setIsLoginOpen(true)}
            className="w-14 h-14 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center transition"
            aria-label="Profil"
          >
            <User size={24} className="text-neutral-700 dark:text-neutral-300" />
          </Button>
        </div>

        <Modal.Backdrop
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          variant="blur"
        >
          <Modal.Container placement="center" size="sm">
            <Modal.Dialog className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4">
              <Modal.CloseTrigger />
              <Modal.Body className="p-0">
                <LoginForm onSuccess={() => setIsLoginOpen(false)} />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </>
    );
  }

  const initial = user.name.charAt(0).toUpperCase();

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
                  {user.name}
                </p>
                <p className="text-xs text-neutral-500 capitalize">
                  {user.role}
                </p>
              </div>
            </Dropdown.Item>
            {user.role === "admin" && (
              <Dropdown.Item id="admin-menus" textValue="admin-menus">
                <Link
                  href="/admin/menus"
                  className="w-full h-full block text-neutral-700 dark:text-neutral-300"
                >
                  Kelola Menu Portal
                </Link>
              </Dropdown.Item>
            )}
            {user.role === "admin" && (
              <Dropdown.Item id="admin-datasets" textValue="admin-datasets">
                <Link
                  href="/admin/datasets"
                  className="w-full h-full block text-neutral-700 dark:text-neutral-300"
                >
                  Kelola Dataset AI
                </Link>
              </Dropdown.Item>
            )}
            {user.role === "admin" && (
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
