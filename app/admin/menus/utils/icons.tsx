import React from "react";
import {
  BookOpenIcon,
  ChartBarIcon,
  FolderIcon,
  GearIcon,
  MonitorIcon,
  SquareIcon,
  StudentIcon,
  TrendUpIcon,
  UsersIcon,
} from "@phosphor-icons/react";

const ICON_MAP: Record<string, React.ReactNode> = {
  monitor: (
    <MonitorIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  folder: (
    <FolderIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  student: (
    <StudentIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  bookopen: (
    <BookOpenIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  trendup: (
    <TrendUpIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  gear: (
    <GearIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  users: (
    <UsersIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
  chartbar: (
    <ChartBarIcon
      size={20}
      weight="duotone"
      className="text-neutral-600 dark:text-neutral-300"
    />
  ),
};

export function getIconComponent(iconName: string): React.ReactNode {
  return (
    ICON_MAP[iconName] || (
      <SquareIcon
        size={20}
        weight="duotone"
        className="text-neutral-600 dark:text-neutral-300"
      />
    )
  );
}
