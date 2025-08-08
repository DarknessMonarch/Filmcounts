import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useConfigStore = create(
  persist(
    (set, get) => ({
      configs: [],
      loading: false,

      setConfigs: (configs) => set({ configs }),
      setLoading: (loading) => set({ loading }),

      addConfig: async (configData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/configs/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(configData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentConfigs = get().configs;
            set({ configs: [...currentConfigs, data.data] });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Config creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      updateConfig: async (configData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/configs/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(configData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentConfigs = get().configs;
            const updatedConfigs = currentConfigs.map(config => 
              config.key === configData.key ? { ...config, ...data.data } : config
            );
            set({ configs: updatedConfigs });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Config update failed" };
        } finally {
          set({ loading: false });
        }
      },

      getConfigs: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/configs/list`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ configs: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch configs" };
        } finally {
          set({ loading: false });
        }
      },

      getConfigByKey: (key) => {
        const configs = get().configs;
        return configs.find(config => config.key === key);
      },

      clearConfigs: () => {
        set({
          configs: [],
          loading: false,
        });
      },
    }),
    {
      name: "config-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);