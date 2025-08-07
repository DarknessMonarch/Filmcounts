import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useSupplierStore = create(
  persist(
    (set, get) => ({
      suppliers: [],
      loading: false,

      setSuppliers: (suppliers) => set({ suppliers }),
      setLoading: (loading) => set({ loading }),

      addSupplier: async (supplierData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/supplier/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(supplierData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentSuppliers = get().suppliers;
            set({ suppliers: [...currentSuppliers, data.data] });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Supplier creation failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Supplier creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      updateSupplier: async (supplierId, supplierData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/supplier/update/${supplierId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(supplierData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentSuppliers = get().suppliers;
            const updatedSuppliers = currentSuppliers.map(supplier => 
              supplier.id === supplierId ? { ...supplier, ...data.data } : supplier
            );
            set({ suppliers: updatedSuppliers });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Supplier update failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Supplier update failed" };
        } finally {
          set({ loading: false });
        }
      },

      getSuppliersByOrg: async (orgId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/supplier/list/${orgId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ suppliers: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch suppliers",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch suppliers" };
        } finally {
          set({ loading: false });
        }
      },

      getIndividualSuppliers: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/supplier/individual/list`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ suppliers: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch individual suppliers",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch individual suppliers" };
        } finally {
          set({ loading: false });
        }
      },

      deleteSupplier: async (supplierId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/supplier/delete/${supplierId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00") {
            const currentSuppliers = get().suppliers;
            const filteredSuppliers = currentSuppliers.filter(supplier => supplier.id !== supplierId);
            set({ suppliers: filteredSuppliers });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Supplier deletion failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Supplier deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearSuppliers: () => {
        set({
          suppliers: [],
          loading: false,
        });
      },
    }),
    {
      name: "supplier-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);