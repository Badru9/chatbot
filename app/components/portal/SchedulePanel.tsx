"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSchedules, deleteSchedules, ScheduleData } from "../../../services/scheduleService";
import { Calendar, Trash, BookOpen, Clock, MapPin } from "@phosphor-icons/react";
import { ScrollShadow } from "@heroui/react";

interface GroupedSchedules {
  [key: string]: ScheduleData[];
}

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function SchedulePanel() {
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery<ScheduleData[]>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchedules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    }
  });

  // Group schedules by day
  const grouped = React.useMemo(() => {
    const groups: GroupedSchedules = {};
    schedules.forEach((item) => {
      if (!groups[item.day]) groups[item.day] = [];
      groups[item.day].push(item);
    });
    return groups;
  }, [schedules]);

  const sortedDays = React.useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      return DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b);
    });
  }, [grouped]);

  return (
    <div className="w-full h-full flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30 border-l border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" weight="fill" />
          <h2 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">Jadwal Mengajar Anda</h2>
        </div>
        {schedules.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin mengosongkan seluruh jadwal?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 flex items-center gap-1 text-xs font-semibold"
          >
            <Trash size={14} />
            Kosongkan
          </button>
        )}
      </div>

      {/* Content */}
      <ScrollShadow className="flex-1 p-6 space-y-6 overflow-y-auto">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-neutral-200 dark:border-neutral-700 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 bg-white dark:bg-neutral-800 shadow-xs">
              <Calendar size={24} />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">Belum Ada Jadwal</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
              Unggah PDF jadwal mengajar Anda di chat saat asisten aktif untuk mengekstrak data secara otomatis.
            </p>
          </div>
        ) : (
          sortedDays.map((day) => (
            <div key={day} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pl-1">{day}</h3>
              <div className="grid grid-cols-1 gap-3">
                {grouped[day].map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 shadow-xs hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-[14px] font-bold text-neutral-900 dark:text-white leading-snug">{item.courseName}</h4>
                      <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50">
                        {item.className}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-neutral-400" />
                        <span>{item.startTime} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-neutral-400" />
                        <span>{item.room}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 mt-1 border-t border-neutral-100 dark:border-neutral-800/60 pt-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 font-bold">
                        <BookOpen size={13} />
                        <span>{item.courseCode || "Tanpa Kode"} • {item.sks} SKS</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </ScrollShadow>
    </div>
  );
}
