import axios from "axios";
import { axiosInstance } from "./axiosInstance";

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
  try {
    const { data } = await axiosInstance.get<ScheduleData[]>("/api/schedules");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}

export async function deleteSchedules(): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await axiosInstance.delete<{ success: boolean; message: string }>("/api/schedules");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}
