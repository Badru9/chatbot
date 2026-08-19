"use client";

import { useAisnetServices } from "@/hooks/useAisnetServices";
import { Research } from "@/lib/types";
import { currencyFormatter } from "@/lib/utils/currencyFormatter";
import { dateFormatter } from "@/lib/utils/dateFormatter";
import { Button, EmptyState, Table } from "@heroui/react";
import { ArchiveIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AiAssistantModal from "../components/ai/AiAssistantModal";
import AiFab from "../components/portal/AiFab";
import DetailModal from "./components/DetailModal";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const COLUMNS = [
  { key: "no", label: "No" },
  { key: "jenis", label: "Jenis" },
  { key: "judul", label: "Judul" },
  { key: "jenisPencairan", label: "Jenis Pencairan" },
  { key: "nominal", label: "Nominal" },
  { key: "tanggal", label: "Tanggal" },
  { key: "aksi", label: "Aksi" },
];

export default function AisnetPage() {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const {
    researches: { data },
  } = useAisnetServices();

  const researchData = data?.data || [];

  return (
    <div className="min-h-screen bg-[#f5f8fa] font-sans antialiased text-[#181c32] flex">
      <Sidebar />

      <div className="flex flex-col flex-1 pl-[265px] min-h-screen">
        <Header />

        {/* Content Table Container */}
        <main className="w-full max-w-6xl mx-auto px-8 py-10 mt-[65px] flex-1">
          <div className="bg-white border border-[#eff2f5] rounded-xl overflow-hidden shadow-xs">
            <Table className="w-full border-collapse">
              <Table.ScrollContainer>
                <Table.Content aria-label="Tabel Penelitian dan PkM">
                  <Table.Header columns={COLUMNS}>
                    {(column) => (
                      <Table.Column
                        key={column.key}
                        isRowHeader
                        className="text-left font-bold text-xs tracking-wider text-[#a1a5b7] bg-[#f5f8fa] border-b border-[#eff2f5] py-4 px-6 uppercase"
                      >
                        {column.label}
                      </Table.Column>
                    )}
                  </Table.Header>
                  <Table.Body
                    renderEmptyState={() => (
                      <EmptyState className="flex h-full w-full flex-col items-center justify-center py-5 gap-4 text-center">
                        <ArchiveIcon size={28} className="text-muted" />
                        <p className="text-muted">Belum ada data penelitian</p>
                      </EmptyState>
                    )}
                  >
                    {researchData?.map((row: Research, index: number) => {
                      return (
                        <Table.Row
                          key={row.id || index}
                          className="hover:bg-[#f9fafb] transition-colors border-b border-[#eff2f5] last:border-none"
                        >
                          <Table.Cell className="font-mono text-center text-sm text-[#a1a5b7] w-12 py-4 px-6">
                            {index + 1}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-[#e1f3fe] text-[#1f6c9f] font-mono">
                              {row.jenis}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-[#181c32] max-w-md truncate py-4 px-6 text-sm">
                            {row.judul}
                          </Table.Cell>
                          <Table.Cell className="py-4 px-6">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#f7f6f3] text-[#555555] font-mono">
                              {row.jenis_pencairan}
                            </span>
                          </Table.Cell>
                          <Table.Cell className="font-mono text-right font-semibold text-[#181c32] py-4 px-6 text-sm whitespace-nowrap">
                            {currencyFormatter(Number(row.biaya))}
                          </Table.Cell>
                          <Table.Cell className="text-[#a1a5b7] text-xs py-4 px-6 whitespace-nowrap">
                            {dateFormatter(row.tanggal)}
                          </Table.Cell>
                          <Table.Cell className="text-center py-4 px-6">
                            <Button
                              variant="primary"
                              className="rounded-md"
                              size="sm"
                              onClick={() => {
                                setSelectedRow(row);
                                setIsDetailOpen(true);
                              }}
                            >
                              Detail
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </main>

        <footer className="w-full max-w-6xl mx-auto px-8 py-6 border-t border-[#eff2f5] text-xs text-[#a1a5b7] flex flex-col sm:flex-row justify-between gap-2 bg-transparent">
          <span>© 2022 AISnet Web Institut Teknologi Garut (ITG)</span>
          <span>Lembaga Sistem Informasi dan Pangkalan Data (LSIPD)</span>
        </footer>
      </div>

      <DetailModal
        row={selectedRow}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <div className="flex fixed right-6 bottom-6 sm:right-8 sm:bottom-8 flex-col gap-3.5 z-40">
        <AiFab onClick={() => setIsAiOpen(true)} />
      </div>
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        tableData={researchData.data}
      />
    </div>
  );
}
