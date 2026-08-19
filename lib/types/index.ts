export type Role = "admin" | "dosen";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role | string;
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
  id: number;
  tr_pengusulan_id: number;
  tahap: string;
  dokumen_pengajuan: string | null;
  biaya: string;
  validasi_staf_lppm: number;
  validasi_lppm: number;
  validasi_rektor: number;
  status: number;
  tanggal: Date | string;
  catatan: string | null;
  slip: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  jenis: string;
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
