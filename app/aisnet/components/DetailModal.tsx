"use client";

import { dateFormatter } from "@/lib/dateFormatter";
import { Modal, Button, Chip, ScrollShadow } from "@heroui/react";

interface TableRowDetail {
  ketuaPeneliti: string;
  anggota: string[];
  skema: string;
  tahunPelaksanaan: string;
  sumberDana: string;
  totalDana: string;
  statusPenelitian: string;
  abstrak: string;
  luaran: string[];
}

interface TableRow {
  no: number;
  jenis: string;
  judul: string;
  jenisPencairan: string;
  nominal: string;
  tanggal: string;
  details: TableRowDetail;
}

export default function DetailModal({
  row,
  isOpen,
  onOpenChange,
}: {
  row: TableRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!row) return null;
  const data = row.details;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
      <Modal.Container placement="center" size="lg">
        <Modal.Dialog className="bg-white rounded-xl shadow-xl border border-neutral-100 max-h-[90vh]">
          <Modal.CloseTrigger className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600" />
          <Modal.Header className="px-6 pt-6 pb-2">
            <Modal.Heading className="text-lg font-bold text-neutral-900 leading-snug">
              {row.judul}
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body className="px-6 py-4">
            <ScrollShadow className="max-h-[60vh] pr-1">
              {/* Status & Type Chips (Spot pastels matching minimalist-ui guidelines) */}
              <div className="flex flex-wrap gap-2 mb-5">
                <Chip
                  className="bg-blue-50 text-blue-700 font-mono text-xs font-semibold"
                  size="sm"
                  variant="soft"
                >
                  <Chip.Label>{row.jenis}</Chip.Label>
                </Chip>
                <Chip
                  className={
                    data.statusPenelitian === "Selesai"
                      ? "bg-green-50 text-green-700 font-mono text-xs font-semibold"
                      : "bg-amber-50 text-amber-700 font-mono text-xs font-semibold"
                  }
                  size="sm"
                  variant="soft"
                >
                  <Chip.Label>{data.statusPenelitian}</Chip.Label>
                </Chip>
                <Chip
                  className="bg-neutral-50 text-neutral-600 font-mono text-xs font-semibold"
                  size="sm"
                  variant="soft"
                >
                  <Chip.Label>{row.jenisPencairan}</Chip.Label>
                </Chip>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <DetailField
                  label="Ketua Peneliti"
                  value={data.ketuaPeneliti}
                />
                <DetailField label="Skema" value={data.skema} />
                <DetailField
                  label="Tahun Pelaksanaan"
                  value={data.tahunPelaksanaan}
                />
                <DetailField label="Sumber Dana" value={data.sumberDana} />
                <DetailField
                  label="Total Dana Penelitian"
                  value={data.totalDana}
                />
                <DetailField label="Nominal Pencairan" value={row.nominal} />
                <DetailField
                  label="Tanggal Pencairan"
                  value={dateFormatter(row.tanggal)}
                />
              </div>

              {/* Anggota */}
              <div className="mb-5">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
                  Anggota Peneliti
                </span>
                <ul className="list-disc list-inside text-sm text-neutral-800 space-y-0.5">
                  {data.anggota.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              {/* Abstrak */}
              <div className="mb-5">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
                  Abstrak
                </span>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {data.abstrak}
                </p>
              </div>

              {/* Luaran */}
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-1.5">
                  Target Luaran
                </span>
                <ul className="list-disc list-inside text-sm text-neutral-800 space-y-0.5">
                  {data.luaran.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </ScrollShadow>
          </Modal.Body>
          <Modal.Footer className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-2 bg-neutral-50/50">
            <Button
              slot="close"
              className="px-4 py-2 text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-400 mb-0.5">
        {label}
      </span>
      <span className="text-sm text-neutral-800 font-medium">{value}</span>
    </div>
  );
}
