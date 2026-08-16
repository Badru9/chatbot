"use client";

import type { DocumentData } from "@/services/documentService";
import { Button, Chip, Spinner, Table } from "@heroui/react";
import {
  CalendarIcon,
  FilePdfIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { formatDate } from "../utils/format";

interface DatasetTableProps {
  documents: DocumentData[] | undefined;
  isLoading: boolean;
  onDelete: (doc: DocumentData) => void;
}

export default function DatasetTable({
  documents,
  isLoading,
  onDelete,
}: DatasetTableProps) {
  return (
    <div className="border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-xs">
      <Table className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabel pengelolaan dataset RAG">
            <Table.Header>
              <Table.Column isRowHeader className="w-16 text-center">
                TIPE
              </Table.Column>
              <Table.Column>NAMA DOKUMEN</Table.Column>
              <Table.Column className="w-36 text-center">
                TOTAL CHUNKS
              </Table.Column>
              <Table.Column className="w-56">TANGGAL UNGGAH</Table.Column>
              <Table.Column className="w-32 text-center">AKSI</Table.Column>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <div className="flex items-center justify-center gap-2 py-8 text-neutral-600 dark:text-neutral-400">
                      <Spinner size={"sm"} className="animate-spin" />
                      <span className="text-sm font-medium">
                        Memuat dokumen...
                      </span>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : documents?.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      Belum ada dokumen PDF terindeks.
                    </span>
                  </Table.Cell>
                </Table.Row>
              ) : (
                documents?.map((doc) => (
                  <Table.Row
                    key={doc.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <Table.Cell>
                      <div className="flex justify-center">
                        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/20 flex items-center justify-center border border-red-100/40 dark:border-red-900/40">
                          <FilePdfIcon
                            size={22}
                            weight="duotone"
                            className="text-red-600 dark:text-red-400"
                          />
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 break-all">
                          {doc.name}
                        </div>
                        {doc.description && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 max-w-sm truncate">
                            {doc.description}
                          </div>
                        )}
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5 max-w-sm truncate">
                          {doc.id}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Chip
                        size="sm"
                        variant="soft"
                        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                      >
                        {doc.chunkCount} chunks
                      </Chip>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                        <CalendarIcon size={16} />
                        {formatDate(doc.uploadedAt)}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-center">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50"
                          onPress={() => onDelete(doc)}
                          aria-label="Hapus berkas"
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
