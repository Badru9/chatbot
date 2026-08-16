"use client";

import { Button, ScrollShadow } from "@heroui/react";
import {
  BookOpenIcon,
  CalendarIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  DotsThreeOutlineIcon,
  FlaskIcon,
  MapPinIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  deleteSchedules,
  fetchSchedules,
  ScheduleData,
} from "../../../services/scheduleService";
import DeleteModal from "../modal/DeleteModal";

interface GroupedSchedules {
  [key: string]: ScheduleData[];
}

const DAY_ORDER = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

type CategoryType = "mengajar" | "penelitian" | "lainnya";

export default function SchedulePanel() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery<ScheduleData[]>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setIsDeleteModalOpen(false);
    },
  });

  // Group schedules by day
  const grouped = useMemo(() => {
    const groups: GroupedSchedules = {};
    schedules.forEach((item) => {
      if (!groups[item.day]) groups[item.day] = [];
      groups[item.day].push(item);
    });
    return groups;
  }, [schedules]);

  const sortedDays = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      return DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b);
    });
  }, [grouped]);

  const handleConfirmDelete = async () => {
    await deleteMutation.mutateAsync();
  };

  const categories = [
    {
      id: "mengajar" as CategoryType,
      title: "Jadwal Mengajar",
      description: "Daftar mata kuliah, waktu, dan ruang perkuliahan.",
      icon: BookOpenIcon,
      badge: schedules.length > 0 ? `${schedules.length} Kelas` : undefined,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: "penelitian" as CategoryType,
      title: "Jadwal Penelitian",
      description: "Agenda riset, hibah, dan eksperimen laboratorium.",
      icon: FlaskIcon,
      badge: undefined,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      id: "lainnya" as CategoryType,
      title: "Jadwal Lainnya",
      description: "Rapat prodi, pengabdian masyarakat, & agenda akademik.",
      icon: DotsThreeOutlineIcon,
      badge: undefined,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
        {selectedCategory === null ? (
          <div className="flex items-center gap-2">
            <CalendarIcon
              size={20}
              className="text-emerald-600 dark:text-emerald-400"
              weight="fill"
            />
            <h2 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
              Jadwal Dosen
            </h2>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Kembali ke Kategori"
            >
              <CaretLeftIcon size={18} weight="bold" />
            </button>
            <h2 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
              {selectedCategory === "mengajar"
                ? "Jadwal Mengajar"
                : selectedCategory === "penelitian"
                  ? "Jadwal Penelitian"
                  : "Jadwal Lainnya"}
            </h2>
          </div>
        )}

        {selectedCategory === "mengajar" && schedules.length > 0 && (
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            isDisabled={deleteMutation.isPending}
            variant="danger-soft"
            size="sm"
          >
            <TrashIcon size={14} />
            Kosongkan
          </Button>
        )}
      </div>

      {/* Content */}
      <ScrollShadow className="flex-1 p-6 space-y-6 overflow-y-auto">
        {selectedCategory === null ? (
          /* List View Kategori */
          <div className="space-y-3">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pl-1 mb-2">
              Pilih Kategori Jadwal
            </p>
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full text-left p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200 hover:scale-[1.01] shadow-xs group flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${cat.bgColor} ${cat.color} shrink-0 mt-0.5`}
                    >
                      <IconComp size={22} weight="bold" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {cat.title}
                        </h3>
                        {cat.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <CaretRightIcon
                    size={16}
                    className="text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0"
                  />
                </button>
              );
            })}
          </div>
        ) : selectedCategory === "mengajar" ? (
          /* Detail View: Jadwal Mengajar */
          isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-neutral-200 dark:border-neutral-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 bg-white dark:bg-neutral-800 shadow-xs">
                <CalendarIcon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                Belum Ada Jadwal Mengajar
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
                Unggah PDF jadwal mengajar Anda di chat saat asisten aktif untuk
                mengekstrak data secara otomatis.
              </p>
            </div>
          ) : (
            sortedDays.map((day) => (
              <div key={day} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pl-1">
                  {day}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {grouped[day].map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-[14px] font-bold text-neutral-900 dark:text-white leading-snug">
                          {item.courseName}
                        </h4>
                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                          {item.className}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <ClockIcon size={14} className="text-neutral-400" />
                          <span>
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPinIcon size={14} className="text-neutral-400" />
                          <span>{item.room}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 mt-1 border-t border-neutral-100 dark:border-neutral-800/60 pt-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-bold">
                          <BookOpenIcon size={13} />
                          <span>
                            {item.courseCode || "Tanpa Kode"} • {item.sks} SKS
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        ) : (
          /* Detail View: Jadwal Penelitian / Lainnya */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 bg-white dark:bg-neutral-800 shadow-xs">
              {selectedCategory === "penelitian" ? (
                <FlaskIcon size={24} />
              ) : (
                <DotsThreeOutlineIcon size={24} />
              )}
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              {selectedCategory === "penelitian"
                ? "Belum Ada Jadwal Penelitian"
                : "Belum Ada Jadwal Lainnya"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
              {selectedCategory === "penelitian"
                ? "Data jadwal penelitian Anda belum tersedia."
                : "Data agenda dan jadwal kegiatan lainnya belum tersedia."}
            </p>
          </div>
        )}
      </ScrollShadow>

      {/* Modal Hapus Konfirmasi */}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Kosongkan Jadwal Mengajar"
          description="Apakah Anda yakin ingin mengosongkan seluruh jadwal mengajar? Data yang sudah dihapus tidak dapat dikembalikan."
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
