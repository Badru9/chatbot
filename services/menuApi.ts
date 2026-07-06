import { MenuData } from "@/lib/types";
import { axiosInstance } from "./axiosInstance";

export type MenuFormValues = Pick<
  MenuData,
  "title" | "description" | "icon" | "href" | "order" | "visibleToRoles"
>;

export interface MenuReorder {
  id: string;
  order: number;
}

export const getMenus = () =>
  axiosInstance.get<MenuData[]>("/api/menus").then((r) => r.data);

export const createMenu = (values: MenuFormValues) =>
  axiosInstance.post<MenuData>("/api/menus", values).then((r) => r.data);

export const updateMenu = (id: string, values: MenuFormValues) =>
  axiosInstance.put<MenuData>(`/api/menus/${id}`, values).then((r) => r.data);

export const deleteMenu = (id: string) =>
  axiosInstance.delete(`/api/menus/${id}`).then((r) => r.data);

export const reorderMenus = (reorders: MenuReorder[]) =>
  axiosInstance.put("/api/menus/reorder", { reorders }).then((r) => r.data);
