"use client";

import type { DatasetItem } from "@/services/datasetService";
import { Button, Chip, Spinner, Switch, Table } from "@heroui/react";
import {
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { formatDate } from "../utils/format";

interface DatasetTableProps {
  datasets: DatasetItem[] | undefined;
  isLoading: boolean;
  onPreview: (dataset: DatasetItem) => void;
  onEdit: (dataset: DatasetItem) => void;
  onDelete: (dataset: DatasetItem) => void;
  onToggleStatus: (dataset: DatasetItem, newStatus: boolean) => void;
}

export default function DatasetTable({
  datasets,
  isLoading,
  onPreview,
  onEdit,
  onDelete,
  onToggleStatus,
}: DatasetTableProps) {
  return (
    <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-xs">
      <Table className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabel pengelolaan dataset pengetahuan AI">
            <Table.Header>
              <Table.Column isRowHeader className="w-16 text-center">
                IKON
              </Table.Column>
              <Table.Column>NAMA DATASET & SUMBER</Table.Column>
              <Table.Column className="w-36 text-center">STATUS AKTIF</Table.Column>
              <Table.Column className="w-48">TERAKHIR DIUBAH</Table.Column>
              <Table.Column className="w-36 text-center">AKSI</Table.Column>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <div className="flex items-center justify-center gap-2 py-8 text-neutral-600 dark:text-neutral-400">
                      <Spinner size={"sm"} className="animate-spin" />
                      <span className="text-sm font-medium">
                        Memuat basis pengetahuan...
                      </span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : datasets?.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <div className="text-center py-8 text-neutral-600 dark:text-neutral-400 font-medium">
                      Belum ada dataset sistem. Klik tombol <strong>Tambah Dataset Sistem</strong> untuk membuat.
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                datasets?.map((ds) => (
                  <Table.Row
                    key={ds.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <Table.Cell>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center border border-emerald-100/40 dark:border-emerald-900/40">
                          <FileTextIcon
                            size={22}
                            weight="duotone"
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 break-words">
                          {ds.name}
                        </div>
                        {ds.description && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 max-w-md line-clamp-1">
                            {ds.description}
                          </div>
                        )}
                        {ds.source && (
                          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
                            Sumber: {ds.source}
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Chip
                          size="sm"
                          variant="soft"
                          className={
                            ds.isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold"
                          }
                        >
                          {ds.isActive ? "Aktif" : "Nonaktif"}
                        </Chip>
                        <Switch
                          size="sm"
                          isSelected={ds.isActive}
                          onChange={(isSelected) => onToggleStatus(ds, isSelected)}
                          aria-label={`Toggle status ${ds.name}`}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                        <CalendarIcon size={16} />
                        {formatDate(
                          ds.updatedAt instanceof Date
                            ? ds.updatedAt.toISOString()
                            : String(ds.updatedAt),
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          onPress={() => onPreview(ds)}
                          aria-label="Lihat Pratinjau Dataset"
                        >
                          <EyeIcon size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          onPress={() => onEdit(ds)}
                          aria-label="Edit Dataset"
                        >
                          <PencilSimpleIcon size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                          onPress={() => onDelete(ds)}
                          aria-label="Hapus Dataset"
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
