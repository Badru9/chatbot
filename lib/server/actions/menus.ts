"use server";

import { prisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/middleware/auth";

export async function getMenusAction() {
  try {
    let menus = await prisma.portalMenu.findMany({
      orderBy: { order: "asc" },
    });

    if (menus.length === 0) {
      const defaultMenus = [
        {
          title: "Monitoring Kinerja",
          description:
            "Analisis dan evaluasi kinerja akademik dosen secara real-time.",
          icon: "ChartBar",
          href: "/admin/kinerja",
          order: 1,
          visibleToRoles: ["admin", "dosen"],
          createdBy: "system",
        },
        {
          title: "AISNET ITG",
          description:
            "Sistem informasi akademik mahasiswa berbasis Artificial Intelligence dengan integrasi Chatbot untuk pelayanan informasi akademik, akademik, presensi kehadiran, laporan kerja harian, serta evaluasi mahasiswa.",
          icon: "Monitor",
          href: "https://aisnet.itg.ac.id/",
          order: 2,
          visibleToRoles: ["admin", "dosen"],
          createdBy: "system",
        },
        {
          title: "E-Learning ITG",
          description:
            "Pengumpulan Tugas, Materi Pembelajaran, Ujian Online, Forum Diskusi, Penilaian Otomatis dan Analisis Kinerja Mahasiswa.",
          icon: "Folder",
          href: "https://elearning.itg.ac.id/",
          order: 3,
          visibleToRoles: ["admin", "dosen"],
          createdBy: "system",
        },
        {
          title: "Bimbingan Mahasiswa",
          description:
            "Akses data mahasiswa bimbingan akademik, laporan magang, konsultasi skripsi, dan KRS.",
          icon: "Student",
          href: "https://pessta.itg.ac.id/",
          order: 4,
          visibleToRoles: ["admin", "dosen"],
          createdBy: "system",
        },
        {
          title: "Portal SINTA",
          description:
            "Integrasi dan sinkronisasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index.",
          icon: "TrendUp",
          href: "https://sinta.kemdikbud.go.id/",
          order: 5,
          visibleToRoles: ["admin", "dosen"],
          createdBy: "system",
        },
      ];

      await prisma.portalMenu.createMany({
        data: defaultMenus,
      });

      menus = await prisma.portalMenu.findMany({
        orderBy: { order: "asc" },
      });
    }

    return menus;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Gagal memuat menu portal.",
    );
  }
}

export async function createMenuAction(values: {
  title: string;
  description: string;
  icon?: string;
  href: string;
  visibleToRoles: string[];
  order?: number;
}) {
  const session = await requireAdmin();

  const {
    title,
    description,
    icon = "Folder",
    href,
    visibleToRoles,
    order,
  } = values;

  if (!title || !description || !href || !Array.isArray(visibleToRoles)) {
    return {
      error: "Kolom title, description, href, dan visibleToRoles wajib diisi.",
    };
  }

  let menuOrder = typeof order === "number" ? order : 0;
  if (typeof order !== "number") {
    const lastMenu = await prisma.portalMenu.findFirst({
      orderBy: { order: "desc" },
    });
    menuOrder = lastMenu ? lastMenu.order + 1 : 1;
  }

  try {
    const menu = await prisma.portalMenu.create({
      data: {
        title,
        description,
        icon,
        href,
        visibleToRoles,
        order: menuOrder,
        createdBy: session.user.id,
      },
    });
    return menu;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal membuat menu baru.",
    };
  }
}

export async function updateMenuAction(
  id: string,
  values: {
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
    visibleToRoles?: string[];
    order?: number;
  },
) {
  await requireAdmin();

  const existing = await prisma.portalMenu.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Menu tidak ditemukan." };
  }

  try {
    const updated = await prisma.portalMenu.update({
      where: { id },
      data: {
        title: values.title !== undefined ? values.title : existing.title,
        description:
          values.description !== undefined
            ? values.description
            : existing.description,
        icon: values.icon !== undefined ? values.icon : existing.icon,
        href: values.href !== undefined ? values.href : existing.href,
        visibleToRoles:
          values.visibleToRoles !== undefined
            ? values.visibleToRoles
            : existing.visibleToRoles,
        order: values.order !== undefined ? values.order : existing.order,
      },
    });
    return updated;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal memperbarui menu.",
    };
  }
}

export async function deleteMenuAction(id: string) {
  await requireAdmin();

  const existing = await prisma.portalMenu.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Menu tidak ditemukan." };
  }

  try {
    await prisma.portalMenu.delete({ where: { id } });
    return { message: "Menu berhasil dihapus." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus menu.",
    };
  }
}

export async function reorderMenusAction(
  reorders: Array<{ id: string; order: number }>,
) {
  await requireAdmin();

  if (!Array.isArray(reorders)) {
    return { error: "Payload reorders wajib berupa array." };
  }

  try {
    await prisma.$transaction(
      reorders.map((item) =>
        prisma.portalMenu.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { message: "Urutan menu berhasil diperbarui." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Gagal memperbarui urutan menu.",
    };
  }
}
