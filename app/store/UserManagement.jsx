import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useUserManagementStore = create(
  persist(
    (set, get) => ({
      users: [],
      organizations: [],
      loading: false,

      setUsers: (users) => set({ users }),
      setOrganizations: (organizations) => set({ organizations }),
      setLoading: (loading) => set({ loading }),

      blockUser: async (userId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/um/user/block/${userId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentUsers = get().users;
            const updatedUsers = currentUsers.map(user => 
              user._id === userId ? { ...user, isBlocked: true } : user
            );
            set({ users: updatedUsers });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "User blocking failed" };
        } finally {
          set({ loading: false });
        }
      },

      unblockUser: async (userId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/um/user/unblock/${userId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentUsers = get().users;
            const updatedUsers = currentUsers.map(user => 
              user._id === userId ? { ...user, isBlocked: false } : user
            );
            set({ users: updatedUsers });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "User unblocking failed" };
        } finally {
          set({ loading: false });
        }
      },

      deleteUser: async (userId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/um/user/delete/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentUsers = get().users;
            const filteredUsers = currentUsers.filter(user => user._id !== userId);
            set({ users: filteredUsers });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "User deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      getAllUsers: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/um/users/all`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ users: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch users" };
        } finally {
          set({ loading: false });
        }
      },

      getAllOrganizations: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/all`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ organizations: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch organizations" };
        } finally {
          set({ loading: false });
        }
      },

      clearUserManagementData: () => {
        set({
          users: [],
          organizations: [],
          loading: false,
        });
      },
    }),
    {
      name: "user-management-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);