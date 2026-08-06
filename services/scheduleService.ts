import {
  fetchSchedulesAction,
  deleteSchedulesAction,
} from "@/lib/server/actions/schedules";

export interface ScheduleData {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseName: string;
  courseCode: string | null;
  className: string;
  room: string;
  sks: number;
}

export async function fetchSchedules(): Promise<ScheduleData[]> {
  return fetchSchedulesAction();
}

export async function deleteSchedules(): Promise<{ success: boolean; message: string }> {
  return deleteSchedulesAction();
}
