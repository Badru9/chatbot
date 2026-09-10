import "dotenv/config";
import { DayOfWeek, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { dosenDataset, prodiDataset } from "@/lib/dataset";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum didefinisikan.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "password123";

/**
 * Hash password
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Convert day from dataset to Prisma enum.
 *
 * Dataset biasanya:
 * "Senin"
 * "Selasa"
 * "Rabu"
 *
 * Prisma:
 * SENIN
 * SELASA
 * RABU
 */
function parseDayOfWeek(day: string): DayOfWeek {
  const normalized = day.trim().toUpperCase();

  const dayMap: Record<string, DayOfWeek> = {
    SENIN: DayOfWeek.SENIN,
    SELASA: DayOfWeek.SELASA,
    RABU: DayOfWeek.RABU,
    KAMIS: DayOfWeek.KAMIS,
    JUMAT: DayOfWeek.JUMAT,
    SABTU: DayOfWeek.SABTU,
    MINGGU: DayOfWeek.MINGGU,
  };

  const result = dayMap[normalized];

  if (!result) {
    throw new Error(
      `Hari "${day}" tidak valid. Gunakan: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, atau Minggu.`,
    );
  }

  return result;
}

/**
 * 1. Seed Roles
 */
async function seedRoles() {
  console.log("Memproses roles...");

  const roles = [
    {
      name: "admin",
      description: "Administrator sistem",
    },
    {
      name: "lecturer",
      description: "Dosen / tenaga pengajar",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: {
        name: role.name,
        description: role.description,
      },
    });
  }

  console.log("Roles berhasil disiapkan.");
}

/**
 * 2. Seed Admin
 */
async function seedAdmin(passwordHash: string) {
  console.log("Memeriksa admin user...");

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@mb.ai",
    },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        name: "Super Admin",
        roleName: "admin",
        emailVerified: true,
      },
    });

    console.log("Admin user sudah ada, data diperbarui.");
    return;
  }

  await prisma.user.create({
    data: {
      email: "admin@mb.ai",
      password: passwordHash,
      name: "Super Admin",
      emailVerified: true,
      roleName: "admin",
    },
  });

  console.log("Admin user berhasil dibuat.");
}

/**
 * 3. Seed Study Programs
 */
async function seedStudyPrograms() {
  console.log("Memproses program studi...");

  for (const prodi of prodiDataset) {
    await prisma.studyProgram.upsert({
      where: {
        code: prodi.code,
      },
      update: {
        name: prodi.name,
        degreeLevel: prodi.degreeLevel,
        faculty: prodi.faculty,
        accreditation: prodi.accreditation,
      },
      create: {
        code: prodi.code,
        name: prodi.name,
        degreeLevel: prodi.degreeLevel,
        faculty: prodi.faculty,
        accreditation: prodi.accreditation,
      },
    });
  }

  console.log(`${prodiDataset.length} program studi berhasil diproses.`);
}

/**
 * 4. Seed Lecturer + Schedule
 */
async function seedLecturers(passwordHash: string) {
  console.log("Memproses akun dosen dan jadwal...");

  for (const dosen of dosenDataset) {
    console.log(`  → ${dosen.name}`);

    /**
     * Cari program studi berdasarkan kode.
     */
    const prodiRecord = await prisma.studyProgram.findUnique({
      where: {
        code: dosen.studyProgramCode,
      },
    });

    if (!prodiRecord) {
      console.warn(
        `    ⚠ Program studi "${dosen.studyProgramCode}" tidak ditemukan.`,
      );
    }

    /**
     * Cari user berdasarkan email.
     */
    const existingUser = await prisma.user.findUnique({
      where: {
        email: dosen.email,
      },
    });

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name: dosen.name,
          nidn: dosen.nidn,
          nip: dosen.nip,
          academicRank: dosen.academicRank,
          highestEducation: dosen.highestEducation,
          studyProgramId: prodiRecord?.id ?? null,

          // IMPORTANT:
          // roleName harus punya record di tabel Role.
          roleName: "lecturer",

          emailVerified: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: dosen.email,
          name: dosen.name,
          password: passwordHash,
          emailVerified: true,
          nidn: dosen.nidn,
          nip: dosen.nip,
          academicRank: dosen.academicRank,
          highestEducation: dosen.highestEducation,
          studyProgramId: prodiRecord?.id ?? null,

          // IMPORTANT:
          // Role lecturer sudah dibuat pada seedRoles().
          roleName: "lecturer",
        },
      });
    }

    /**
     * Reset schedule agar seed bersifat idempotent.
     */
    await prisma.schedule.deleteMany({
      where: {
        userId: user.id,
      },
    });

    /**
     * Insert schedule baru.
     */
    if (dosen.schedules?.length) {
      for (const sched of dosen.schedules) {
        await prisma.schedule.create({
          data: {
            userId: user.id,

            // Dataset -> Prisma enum
            day: parseDayOfWeek(sched.day),

            startTime: sched.startTime,
            endTime: sched.endTime,
            courseName: sched.courseName,
            courseCode: sched.courseCode ?? null,
            className: sched.className,
            room: sched.room,
            sks: sched.sks ?? 2,
          },
        });
      }
    }
  }

  console.log(
    `${dosenDataset.length} akun dosen dan jadwal berhasil diproses.`,
  );
}

/**
 * 5. Seed Dataset Tridarma + SINTA
 */
async function seedTridarmaDataset() {
  console.log("Menyimpan dataset Tridarma & SINTA...");

  const content = JSON.stringify(
    dosenDataset.map((dosen) => ({
      nama: dosen.name,
      email: dosen.email,
      nidn: dosen.nidn,
      tridarma: dosen.tridarmaDetail,
    })),
    null,
    2,
  );

  await prisma.dataset.upsert({
    where: {
      id: "dataset-tridarma-dosen",
    },
    update: {
      name: "Dataset Tridarma & SINTA Dosen",
      description:
        "Detail rekapitulasi Tridarma, skor SINTA, publikasi, dan hibah penelitian dosen.",
      content,
      source: "sistem_internal",
      isActive: true,
      createdBy: "system",
    },
    create: {
      id: "dataset-tridarma-dosen",
      name: "Dataset Tridarma & SINTA Dosen",
      description:
        "Detail rekapitulasi Tridarma, skor SINTA, publikasi, dan hibah penelitian dosen.",
      content,
      source: "sistem_internal",
      isActive: true,
      createdBy: "system",
    },
  });

  console.log("Dataset Tridarma berhasil disimpan.");
}

/**
 * 6. Seed Portal Menus
 */
async function seedPortalMenus() {
  console.log("Memproses portal menu...");

  const defaultMenus = [
    {
      title: "AISNET ITG",
      description:
        "Sistem informasi akademik berbasis AI untuk pelayanan informasi, presensi, dan evaluasi.",
      icon: "Monitor",
      href: "https://aisnet.itg.ac.id/",
      order: 1,
      visibleToRoles: ["admin", "lecturer"],
      createdBy: "system",
    },
    {
      title: "E-Learning ITG",
      description:
        "Pengumpulan tugas, materi pembelajaran, ujian online, dan penilaian otomatis.",
      icon: "Folder",
      href: "https://elearning.itg.ac.id/",
      order: 2,
      visibleToRoles: ["admin", "lecturer"],
      createdBy: "system",
    },
    {
      title: "Bimbingan Mahasiswa",
      description:
        "Akses data bimbingan akademik, laporan magang, konsultasi skripsi, dan KRS.",
      icon: "Student",
      href: "https://pessta.itg.ac.id/",
      order: 3,
      visibleToRoles: ["admin", "lecturer"],
      createdBy: "system",
    },
    {
      title: "Portal SINTA",
      description:
        "Integrasi otomatis skor SINTA, Scopus, Google Scholar, dan H-index.",
      icon: "TrendUp",
      href: "https://sinta.kemdikbud.go.id/",
      order: 5,
      visibleToRoles: ["admin", "lecturer"],
      createdBy: "system",
    },
  ];

  for (const menu of defaultMenus) {
    const existingMenu = await prisma.portalMenu.findFirst({
      where: {
        title: menu.title,
        href: menu.href,
      },
    });

    if (existingMenu) {
      await prisma.portalMenu.update({
        where: {
          id: existingMenu.id,
        },
        data: {
          description: menu.description,
          icon: menu.icon,
          order: menu.order,
          visibleToRoles: menu.visibleToRoles,
          createdBy: menu.createdBy,
        },
      });
    } else {
      await prisma.portalMenu.create({
        data: menu,
      });
    }
  }

  console.log(`${defaultMenus.length} portal menu berhasil diproses.`);
}

/**
 * 7. Seed AI Setting
 */
async function seedAiSetting() {
  console.log("Memeriksa AI settings...");

  await prisma.aiSetting.upsert({
    where: {
      id: "default",
    },
    update: {},
    create: {
      id: "default",
      activeProvider: "gemini",
      geminiPrimary: "gemini-3.8-flash",
      geminiFallbacks: [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash-lite",
      ],
      ollamaBaseUrl: "http://localhost:11434",
      ollamaModel: "llama3.2",
      enableAutoFallback: true,
      enableCrossFallback: true,
    },
  });

  console.log("AI settings berhasil disiapkan.");
}

/**
 * Main seed
 */
async function seed() {
  console.log("========================================");
  console.log("Memulai seeding database...");
  console.log("========================================");

  try {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    // IMPORTANT:
    // Role harus dibuat SEBELUM User.
    await seedRoles();

    await seedAdmin(passwordHash);

    await seedStudyPrograms();

    await seedLecturers(passwordHash);

    await seedTridarmaDataset();

    await seedPortalMenus();

    await seedAiSetting();

    console.log("========================================");
    console.log("Seeding database berhasil.");
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error("Gagal menjalankan seeder:");
    console.error(error);
    console.error("========================================");

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();

export {};
