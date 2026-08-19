"use server";

import { prisma } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/middleware/auth";
import { hashPassword } from "@/lib/server/services/auth";
import { CreateUserInput, UserData } from "@/lib/types";

const DEFAULT_PASSWORD = "password123";

export async function getUsersAction(): Promise<UserData[]> {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users as UserData[];
}

export async function createUserAction(values: CreateUserInput) {
  await requireAdmin();

  const { name, email, role } = values;

  if (!name || !email || !role) {
    return { error: "Semua kolom wajib diisi." };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email sudah terdaftar. Gunakan email lain." };
  }

  try {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return newUser as UserData;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal membuat user baru.",
    };
  }
}

export async function deleteUserAction(id: string) {
  const session = await requireAdmin();

  if (!id) {
    return { error: "ID user wajib disertakan." };
  }

  // Protection: prevent admin from deleting own account
  if (session.user.id === id) {
    return {
      error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return { error: "User tidak ditemukan." };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return { success: true, message: "User berhasil dihapus." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal menghapus user.",
    };
  }
}
