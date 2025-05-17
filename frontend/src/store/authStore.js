import { create } from "zustand";

// ✅ Replace with full backend URL
const API_URL = "http://localhost:3000/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      set({ isLoading: false, isAuthenticated: true, user: data.user });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Signup error:", error);
      return false;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");

      set({ isLoading: false, isAuthenticated: true, user: data.user });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Verify email error:", error);
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      set({ isLoading: false, isAuthenticated: true, user: data.user });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Login error:", error);
      return false;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        credentials: "include", // must include cookies to send token
      });
      const data = await response.json();
      if (response.ok && data.user) {
        set({ isAuthenticated: true, user: data.user, isCheckingAuth: false });
      } else {
        set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      }
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      console.error("Check auth error:", error);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      set({ isLoading: false, isAuthenticated: false, user: null });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  sendResetCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/send-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send reset code");

      set({ isLoading: false, message: data.message });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Send reset code error:", error);
      throw error;
    }
  },

  verifyResetCode: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid or expired reset code");

      set({ isLoading: false, message: data.message });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Verify reset code error:", error);
      throw error;
    }
  },

  resetPassword: async (email, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reset password failed");

      set({ isLoading: false, message: data.message });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Reset password error:", error);
      throw error;
    }
  },
}));
