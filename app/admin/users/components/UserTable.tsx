"use client";

import { UserData } from "@/lib/types";
import { dateFormatter } from "@/lib/utils/dateFormatter";
import { Button, Chip, Table } from "@heroui/react";
import { Trash, User as UserIcon } from "@phosphor-icons/react";

interface UserTableProps {
  users: UserData[];
  onDelete: (user: UserData) => void;
  currentUserId?: string;
}

export default function UserTable({
  users,
  onDelete,
  currentUserId,
}: UserTableProps) {
  return (
    <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-xs">
      <Table className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabel pengelolaan akun user">
            <Table.Header>
              <Table.Column isRowHeader className="w-16">
                NO
              </Table.Column>
              <Table.Column>NAMA USER</Table.Column>
              <Table.Column>EMAIL</Table.Column>
              <Table.Column className="w-36">ROLE</Table.Column>
              <Table.Column className="w-48">TANGGAL DIBUAT</Table.Column>
              <Table.Column className="w-24 text-center">AKSI</Table.Column>
            </Table.Header>
            <Table.Body>
              {users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                      Belum ada data user.
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                users.map((user, idx) => {
                  const isCurrentUser = currentUserId === user.id;

                  return (
                    <Table.Row
                      key={user.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <Table.Cell className="text-neutral-400 font-mono text-xs">
                        {idx + 1}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-semibold text-xs border border-neutral-200/60 dark:border-neutral-700/60 shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                              {user.name}
                            </p>
                            {isCurrentUser && (
                              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                                Akun Anda
                              </span>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-300 font-mono">
                          {user.email}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Chip
                          size="sm"
                          className={
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                          }
                        >
                          {user.role}
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {dateFormatter(user.createdAt)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                          isDisabled={isCurrentUser}
                          onClick={() => onDelete(user)}
                          aria-label={
                            isCurrentUser
                              ? "Anda tidak dapat menghapus akun Anda sendiri"
                              : `Hapus user ${user.name}`
                          }
                        >
                          <Trash size={16} />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
