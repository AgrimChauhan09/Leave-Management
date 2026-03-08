import { defineStore } from "pinia";
import { api } from "../lib/api.js";

const LS_TOKEN = "leave_token";
const LS_USER = "leave_user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(LS_TOKEN) || "",
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_USER) || "null");
      } catch {
        return null;
      }
    })(),
    loading: false,
    error: ""
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.token)
  },
  actions: {
    setSession({ token, user }) {
      this.token = token;
      this.user = user;
      localStorage.setItem(LS_TOKEN, token);
      localStorage.setItem(LS_USER, JSON.stringify(user));
    },
    clearSession() {
      this.token = "";
      this.user = null;
      localStorage.removeItem(LS_TOKEN);
      localStorage.removeItem(LS_USER);
    },
    async signup(payload) {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.post("/api/auth/signup", payload);
        this.setSession(data);
        return true;
      } catch (e) {
        this.error = e?.response?.data?.error || "Signup failed";
        return false;
      } finally {
        this.loading = false;
      }
    },
    async login(payload) {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.post("/api/auth/login", payload);
        this.setSession(data);
        return true;
      } catch (e) {
        this.error = e?.response?.data?.error || "Login failed";
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});

