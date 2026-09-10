import { ResearchType, Role, ValidationStatus } from "@prisma/client";

export type VisibleRole = "admin" | "dosen";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  createdAt: string | Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: Role;
}

export interface MenuData {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  href: string;
  visibleToRoles: Role[];
  order?: number;
  createdBy?: string;
}

export interface Research {
  id: string;
  tr_pengusulan_id: string;
  tahap: string;
  dokumen_pengajuan: string | null;
  biaya: string;
  validasi_staf_lppm: ValidationStatus;
  validasi_lppm: ValidationStatus;
  validasi_rektor: ValidationStatus;
  status: number;
  tanggal: Date | string;
  catatan: string | null;
  slip: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  jenis: ResearchType;
  judul: string;
  rencana_luaran: string;
  dana_internal: number;
  nama_dosen: string;
  jenis_pencairan: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
  hasChevron?: boolean;
}

export interface NavSection {
  heading?: string;
  items: NavItem[];
}

export interface UserSession {
  name: string;
}
