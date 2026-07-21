export interface MenuData {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  href: string;
  visibleToRoles: string[];
  order?: number;
  createdBy?: string;
}
