import { MenuData } from "@/lib/types";
import type { MenuFormValues } from "@/services/menuApi";
import {
  createMenu,
  deleteMenu,
  getMenus,
  reorderMenus,
  updateMenu,
} from "@/services/menuApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MENUS_KEY = ["menus"];

export function useMenuServices() {
  const queryClient = useQueryClient();

  const menusQuery = useQuery<MenuData[]>({
    queryKey: MENUS_KEY,
    queryFn: getMenus,
  });

  const createMutation = useMutation({
    mutationFn: (values: MenuFormValues) => createMenu(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: MenuFormValues }) =>
      updateMenu(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });

  const reorderMutation = useMutation({
    mutationFn: (reorders: { id: string; order: number }[]) =>
      reorderMenus(reorders),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
  });

  const handleMove = (index: number, direction: "up" | "down") => {
    const menus = menusQuery.data ?? [];
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

    queryClient.setQueryData(MENUS_KEY, updated);

    const id1 = updated[index].id;
    const id2 = updated[targetIndex].id;
    if (!id1 || !id2) return;

    reorderMutation.mutate(
      [
        { id: id1, order: updated[index].order ?? 0 },
        { id: id2, order: updated[targetIndex].order ?? 0 },
      ],
      {
        onError: () =>
          queryClient.invalidateQueries({ queryKey: MENUS_KEY }),
      },
    );
  };

  return {
    menus: menusQuery.data ?? [],
    isLoading: menusQuery.isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    handleMove,
  };
}
