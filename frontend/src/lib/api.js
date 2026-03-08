import axios from "axios";

const LS_TOKEN = "leave_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ""
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LS_TOKEN) || "";
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

