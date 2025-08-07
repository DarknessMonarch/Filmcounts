import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useDepartmentStore = create(
  persist(
    (set, get) => ({
      departments: [],
      loading: false,

      setDepartments: (departments) => set({ departments }),
      setLoading: (loading) => set({ loading }),

      addDepartment: async (departmentData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/department/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(departmentData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentDepartments = get().departments;
            set({ departments: [...currentDepartments, data.data] });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Department creation failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Department creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      updateDepartment: async (departmentId, departmentData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/department/update/${departmentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(departmentData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentDepartments = get().departments;
            const updatedDepartments = currentDepartments.map(department => 
              department.id === departmentId ? { ...department, ...data.data } : department
            );
            set({ departments: updatedDepartments });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Department update failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Department update failed" };
        } finally {
          set({ loading: false });
        }
      },

      getDepartmentsByOrg: async (orgId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/department/list/${orgId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ departments: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch departments",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch departments" };
        } finally {
          set({ loading: false });
        }
      },

      deleteDepartment: async (departmentId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/content/department/delete/${departmentId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00") {
            const currentDepartments = get().departments;
            const filteredDepartments = currentDepartments.filter(department => department.id !== departmentId);
            set({ departments: filteredDepartments });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Department deletion failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Department deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearDepartments: () => {
        set({
          departments: [],
          loading: false,
        });
      },
    }),
    {
      name: "department-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);