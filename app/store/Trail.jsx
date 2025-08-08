import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useTrailStore = create(
  persist(
    (set, get) => ({
      trails: [],
      loading: false,

      setTrails: (trails) => set({ trails }),
      setLoading: (loading) => set({ loading }),

      searchTrail: async (searchParams) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/at/search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              filters: searchParams,
              page: 0,
              size: parseInt(searchParams.limit) || 50
            }),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ trails: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Trail search failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearTrails: () => {
        set({
          trails: [],
          loading: false,
        });
      },
    }),
    {
      name: "trail-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);