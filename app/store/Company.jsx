import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useCompanyStore = create(
  persist(
    (set, get) => ({
      companies: [],
      loading: false,

      setCompanies: (companies) => set({ companies }),
      setLoading: (loading) => set({ loading }),

      addCompany: async (companyData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/company/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(companyData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentCompanies = get().companies;
            set({ companies: [...currentCompanies, data.data] });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Company creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      updateCompany: async (companyId, companyData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/company/update/${companyId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(companyData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentCompanies = get().companies;
            const updatedCompanies = currentCompanies.map(company => 
              company._id === companyId ? { ...company, ...data.data } : company
            );
            set({ companies: updatedCompanies });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Company update failed" };
        } finally {
          set({ loading: false });
        }
      },

      getCompaniesByOrg: async (orgId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/company/list/${orgId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ companies: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch companies" };
        } finally {
          set({ loading: false });
        }
      },

      getCompaniesForIndividual: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/company/individual/list`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ companies: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch individual companies" };
        } finally {
          set({ loading: false });
        }
      },

      deleteCompany: async (companyId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/company/delete/${companyId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentCompanies = get().companies;
            const filteredCompanies = currentCompanies.filter(company => company._id !== companyId);
            set({ companies: filteredCompanies });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Company deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearCompanies: () => {
        set({
          companies: [],
          loading: false,
        });
      },
    }),
    {
      name: "company-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);