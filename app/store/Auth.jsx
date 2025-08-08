import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuth: false,
      tokens: {
        accessToken: null,
        refreshToken: null,
      },

      setUser: (user) => set({ user, isAuth: true }),
      setTokens: (tokens) => set({ tokens }),

      register: async (userData) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            // Store user data from the response
            get().setUser(data.data);
            // Store tokens with correct property names from API
            get().setTokens({
              accessToken: data.data.access_token,
              refreshToken: data.data.refresh_token,
            });
          }

          return { success: res.ok, data };
        } catch (error) {
          console.error("Registration error:", error);
          return { success: false, error: "Registration failed" };
        }
      },

      login: async (credentials) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            // Store user data from the response
            get().setUser(data.data);
            // Store tokens with correct property names from API
            get().setTokens({
              accessToken: data.data.access_token,
              refreshToken: data.data.refresh_token,
            });
          }

          return { success: res.ok, data };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, error: "Login failed" };
        }
      },

      verifyEmail: async (token, code) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/verify/email/${token}/${code}`, {
            method: "POST",
          });
          const data = await res.json();
          return { success: res.ok, data };
        } catch (error) {
          console.error("Email verification error:", error);
          return { success: false, error: "Email verification failed" };
        }
      },

      resendEmailVerification: async (email) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/email-verification/resend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          return { success: res.ok, data };
        } catch (error) {
          console.error("Resend email verification error:", error);
          return { success: false, error: "Resend email verification failed" };
        }
      },

      verifyForgotLink: async (token, code) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/verify/forgot/${token}/${code}`, {
            method: "POST",
          });
          const data = await res.json();
          return { success: res.ok, data };
        } catch (error) {
          console.error("Forgot verification error:", error);
          return { success: false, error: "Forgot verification failed" };
        }
      },

      sendForgotPassword: async (emailData) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
          });
          const data = await res.json();
          return { success: res.ok, data };
        } catch (error) {
          console.error("Forgot password error:", error);
          return { success: false, error: "Forgot password failed" };
        }
      },

      resetPassword: async (resetData) => {
        try {
          const res = await fetch(`${SERVER_API}/um/public/recovery/reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resetData),
          });
          const data = await res.json();
          return { success: res.ok, data };
        } catch (error) {
          console.error("Reset password error:", error);
          return { success: false, error: "Reset failed" };
        }
      },

      logout: async () => {
        const { accessToken } = get().tokens || {};
        try {
          const res = await fetch(`${SERVER_API}/um/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          });
          if (res.ok) {
            set({ user: null, isAuth: false, tokens: { accessToken: null, refreshToken: null } });
          }
          return { success: res.ok };
        } catch (error) {
          console.error("Logout error:", error);
          return { success: false, error: "Logout failed" };
        }
      },

      // Helper method to get user organizations
      getUserOrganizations: () => {
        const { user } = get();
        return user?.organizations || [];
      },

      // Helper method to check if user has admin role in any organization
      isUserAdmin: () => {
        const organizations = get().getUserOrganizations();
        return organizations.some(org => 
          org.roles && org.roles.some(role => 
            role === "ADMIN" || role === "ADMINISTRATOR"
          )
        );
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);