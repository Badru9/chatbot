"use client";

import { MenuData } from "@/lib/types";
import type { MenuFormValues } from "@/services/menuApi";
import {
  createMenu,
  deleteMenu,
  getMenus,
  reorderMenus,
  updateMenu,
} from "@/services/menuApi";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Label,
  Modal,
  Spinner,
  Table,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  ArrowLeft,
  BookOpen,
  CaretDown,
  CaretUp,
  ChartBar,
  Folder,
  Gear,
  Monitor,
  Pencil,
  Plus,
  Square,
  Student,
  Trash,
  TrendUp,
  Users,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import PortalLayout from "../../(portal)/layout";
import MenusLoading from "./MenusLoading";

export default function AdminMenusPage() {
  const queryClient = useQueryClient();

  // TanStack Query for fetching menus
  const { data: menus = [], isLoading } = useQuery<MenuData[]>({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (values: MenuFormValues) => createMenu(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: MenuFormValues }) =>
      updateMenu(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: (reorders: { id: string; order: number }[]) =>
      reorderMenus(reorders),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
  });

  // Local state
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Monitor");
  const [href, setHref] = useState("");
  const [visibleToRoles, setVisibleToRoles] = useState<string[]>([
    "admin",
    "dosen",
  ]);
  const [order, setOrder] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Monitor: (
        <Monitor
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      Folder: (
        <Folder
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      Student: (
        <Student
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      BookOpen: (
        <BookOpen
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      TrendUp: (
        <TrendUp
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      Gear: (
        <Gear
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      Users: (
        <Users
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
      ChartBar: (
        <ChartBar
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      ),
    };
    return (
      icons[iconName] || (
        <Square
          size={20}
          weight="duotone"
          className="text-neutral-600 dark:text-neutral-300"
        />
      )
    );
  };

  const handleOpenAdd = () => {
    setSelectedMenu(null);
    setTitle("");
    setDescription("");
    setIcon("Monitor");
    setHref("");
    setVisibleToRoles(["admin", "dosen"]);
    setOrder(menus.length > 0 ? Math.max(...menus.map((m) => m.order ?? 0)) + 1 : 1);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (menu: MenuData) => {
    setSelectedMenu(menu);
    setTitle(menu.title);
    setDescription(menu.description);
    setHref(menu.href);
    setVisibleToRoles(menu.visibleToRoles);
    setOrder(menu.order ?? 1);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (menu: MenuData) => {
    setDeleteTarget(menu);
    setIsDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!title || !description || !icon || !href) {
      toast("Semua kolom wajib diisi.", {
        variant: "danger",
      });
      return;
    }

    const payload: MenuFormValues = {
      title,
      description,
      icon,
      href,
      visibleToRoles,
      order,
    };

    if (selectedMenu && selectedMenu.id) {
      updateMutation.mutate(
        { id: selectedMenu.id, values: payload },
        { onSuccess: () => setIsFormOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget || !deleteTarget.id) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === menus.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...menus];

    const tempOrder = updated[index].order;
    updated[index] = { ...updated[index], order: updated[targetIndex].order };
    updated[targetIndex] = { ...updated[targetIndex], order: tempOrder };

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Optimistic update
    queryClient.setQueryData(["menus"], updated);

    const id1 = updated[index].id;
    const id2 = updated[targetIndex].id;
    if (!id1 || !id2) return;

    reorderMutation.mutate(
      [
        { id: id1, order: updated[index].order ?? 0 },
        { id: id2, order: updated[targetIndex].order ?? 0 },
      ],
      {
        onError: () => queryClient.invalidateQueries({ queryKey: ["menus"] }),
      },
    );
  };

  if (isLoading) {
    return (
      <PortalLayout>
        <MenusLoading />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="w-full max-w-5xl flex flex-col gap-6 mt-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="ghost"
                className="rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <p className="text-xs text-neutral-400">Portal / Admin</p>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Kelola Menu Portal
              </h1>
            </div>
          </div>
          <Button
            onClick={handleOpenAdd}
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-bold flex items-center gap-2 cursor-pointer shadow-md rounded-xl px-4 py-2 text-sm"
          >
            <Plus size={18} weight="bold" />
            Tambah Menu
          </Button>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
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
                        <span className="text-sm text-neutral-500">
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
                              onClick={() => handleMove(idx, "up")}
                            >
                              <CaretUp size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer"
                              isDisabled={idx === menus.length - 1}
                              onClick={() => handleMove(idx, "down")}
                            >
                              <CaretDown size={16} />
                            </Button>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                              {menu.title}
                            </div>
                            <div className="text-xs text-neutral-400 font-mono mt-0.5">
                              {menu.href}
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
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
                              onClick={() => handleOpenEdit(menu)}
                              aria-label="Edit menu"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="ghost"
                              className="cursor-pointer text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                              onClick={() => handleOpenDelete(menu)}
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
      </div>

      <Modal isOpen={isFormOpen} onOpenChange={setIsFormOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="lg">
            <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl outline-none">
              <Modal.Header>
                <Modal.Heading className="text-xl font-bold text-neutral-900 dark:text-white">
                  {selectedMenu
                    ? "Edit Menu Portal"
                    : "Tambah Menu Portal Baru"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="gap-4 mt-4 space-y-3">
                <TextField
                  value={title}
                  onChange={setTitle}
                  isRequired
                  className="w-full flex flex-col gap-1.5"
                >
                  <Label className="text-xs text-neutral-500 font-medium">
                    Judul Menu
                  </Label>
                  <Input
                    placeholder="Masukkan judul menu (misal: Portal SINTA)"
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>
                <TextField
                  value={description}
                  onChange={setDescription}
                  isRequired
                  className="w-full flex flex-col gap-1.5"
                >
                  <Label className="text-xs text-neutral-500 font-medium">
                    Deskripsi
                  </Label>
                  <TextArea
                    placeholder="Masukkan deskripsi singkat tentang kegunaan menu ini..."
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-20 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                  />
                </TextField>
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    value={href}
                    onChange={setHref}
                    isRequired
                    className="w-full flex flex-col gap-1.5"
                  >
                    <Label className="text-xs text-neutral-500 font-medium">
                      Link Navigasi (Href)
                    </Label>
                    <Input
                      placeholder="https://portal-sinta.kemdikbud.go.id/"
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                    />
                  </TextField>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <TextField
                    value={String(order)}
                    onChange={(val) => setOrder(Number(val))}
                    className="w-full flex flex-col gap-1.5"
                  >
                    <Label className="text-xs text-neutral-500 font-medium">
                      No. Urut (Order)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent min-h-10 text-sm outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                    />
                  </TextField>
                  <div className="flex flex-col gap-1.5 pl-1">
                    <span className="text-xs text-neutral-500 font-medium">
                      Akses Peran (Roles)
                    </span>
                    <CheckboxGroup
                      value={visibleToRoles}
                      onChange={setVisibleToRoles}
                      className="flex flex-row gap-4"
                    >
                      <Checkbox value="admin">
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                        <Chip>admin</Chip>
                      </Checkbox>
                      <Checkbox value="dosen">
                        <Checkbox.Content>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        </Checkbox.Content>
                        <Chip>dosen</Chip>
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setIsFormOpen(false)}
                  className="cursor-pointer px-4 py-2 text-sm rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  isDisabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="cursor-pointer font-bold px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Spinner size={"sm"} className="mr-2" />
                  )}
                  Simpan
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <Modal.Backdrop className="fixed inset-0 bg-black/60 backdrop-blur-md z-99 flex items-center justify-center p-4">
          <Modal.Container>
            <Modal.Dialog className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full outline-none">
              <Modal.Header>
                <Modal.Heading className="text-lg font-bold text-danger">
                  Konfirmasi Hapus
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="mt-2 text-sm text-neutral-500">
                Apakah Anda yakin ingin menghapus menu{" "}
                <strong>{deleteTarget?.title}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </Modal.Body>
              <Modal.Footer className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteOpen(false)}
                  className="cursor-pointer px-4 py-2 text-sm rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDelete}
                  isDisabled={deleteMutation.isPending}
                  className="cursor-pointer font-bold px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-xl"
                >
                  {deleteMutation.isPending && (
                    <Spinner size={"sm"} className="mr-2" />
                  )}
                  Hapus
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </PortalLayout>
  );
}
