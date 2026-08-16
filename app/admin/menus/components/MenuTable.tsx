"use client";

import { MenuData } from "@/lib/types";
import { Button, Chip, Table } from "@heroui/react";
import { CaretDown, CaretUp, Pencil, Trash } from "@phosphor-icons/react";

interface MenuTableProps {
  menus: MenuData[];
  onEdit: (menu: MenuData) => void;
  onDelete: (menu: MenuData) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

export default function MenuTable({
  menus,
  onEdit,
  onDelete,
  onMove,
}: MenuTableProps) {
  return (
    <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-xs">
      <Table className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabel pengelolaan menu portal">
            <Table.Header>
              <Table.Column isRowHeader className="w-20">
                URUTAN
              </Table.Column>
              <Table.Column>JUDUL & LINK</Table.Column>
              <Table.Column>DESKRIPSI</Table.Column>
              <Table.Column className="w-48">HAK AKSES</Table.Column>
              <Table.Column className="w-32 text-center">AKSI</Table.Column>
            </Table.Header>
            <Table.Body>
              {menus.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      Tidak ada menu portal.
                    </span>
                  </Table.Cell>
                </Table.Row>
              ) : (
                menus.map((menu, idx) => (
                  <Table.Row
                    key={menu.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <Table.Cell>
                      <div className="flex items-center gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer"
                          isDisabled={idx === 0}
                          onClick={() => onMove(idx, "up")}
                        >
                          <CaretUp size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer"
                          isDisabled={idx === menus.length - 1}
                          onClick={() => onMove(idx, "down")}
                        >
                          <CaretDown size={16} />
                        </Button>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {menu.title}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                          {menu.href}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate font-medium">
                        {menu.description}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1 flex-wrap">
                        {menu.visibleToRoles.map((role) => (
                          <Chip
                            key={role}
                            size="sm"
                            variant="soft"
                            color={role === "admin" ? "success" : "default"}
                          >
                            {role}
                          </Chip>
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() => onEdit(menu)}
                          aria-label="Edit menu"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                          onClick={() => onDelete(menu)}
                          aria-label="Hapus menu"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
