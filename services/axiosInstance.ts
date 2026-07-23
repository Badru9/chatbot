import { API_BASE_URL } from "@/constants";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
