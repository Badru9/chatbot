import { MenuData } from "@/lib/types";
import {
  getMenusAction,
  createMenuAction,
  updateMenuAction,
  deleteMenuAction,
  reorderMenusAction,
} from "@/lib/server/actions/menus";

export type MenuFormValues = Pick<
  MenuData,
  "title" | "description" | "icon" | "href" | "order" | "visibleToRoles"
>;

export interface MenuReorder {
  id: string;
  order: number;
}

export const getMenus = async (): Promise<MenuData[]> => {
  return (await getMenusAction()) as MenuData[];
};

export const createMenu = async (values: MenuFormValues): Promise<MenuData> => {
  const res = await createMenuAction(values);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res as MenuData;
};

export const updateMenu = async (
  id: string,
  values: MenuFormValues,
): Promise<MenuData> => {
  const res = await updateMenuAction(id, values);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res as MenuData;
};

export const deleteMenu = async (id: string): Promise<any> => {
  const res = await deleteMenuAction(id);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res;
};

export const reorderMenus = async (reorders: MenuReorder[]): Promise<any> => {
  const res = await reorderMenusAction(reorders);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res;
};
