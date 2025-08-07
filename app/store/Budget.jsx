import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],
      budgetItems: [],
      loading: false,

      setBudgets: (budgets) => set({ budgets }),
      setBudgetItems: (budgetItems) => set({ budgetItems }),
      setLoading: (loading) => set({ loading }),

      // Create Budget
      createBudget: async (projectId, budgetData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/project/budget/create/${projectId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(budgetData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentBudgets = get().budgets;
            set({ budgets: [...currentBudgets, data.data] });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Budget creation failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Budget creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      // Submit Budget
      submitBudget: async (projectId, budgetData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/project/budget/submit/${projectId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(budgetData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentBudgets = get().budgets;
            const updatedBudgets = currentBudgets.map(budget => 
              budget.id === data.data.id ? { ...budget, ...data.data } : budget
            );
            set({ budgets: updatedBudgets });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Budget submission failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Budget submission failed" };
        } finally {
          set({ loading: false });
        }
      },

      // Get Unsubmitted Budgets
      getUnsubmittedBudgets: async (projectId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const requestBody = {
            filters: {},
            page: 0,
            size: 10
          };

          const res = await fetch(`${SERVER_API}/project/budget/list/unsubmitted/${projectId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ budgets: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch unsubmitted budgets",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch unsubmitted budgets" };
        } finally {
          set({ loading: false });
        }
      },

      // Get Submitted Budgets
      getSubmittedBudgets: async (projectId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const requestBody = {
            filters: {},
            page: 0,
            size: 10
          };

          const res = await fetch(`${SERVER_API}/project/budget/list/submitted/${projectId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ budgets: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch submitted budgets",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch submitted budgets" };
        } finally {
          set({ loading: false });
        }
      },

      // Get Approved Budgets
      getApprovedBudgets: async (projectId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const requestBody = {
            filters: {},
            page: 0,
            size: 10
          };

          const res = await fetch(`${SERVER_API}/project/budget/list/approved/${projectId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            set({ budgets: data.data });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Failed to fetch approved budgets",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Failed to fetch approved budgets" };
        } finally {
          set({ loading: false });
        }
      },

      // Add Budget Item
      addBudgetItem: async (itemData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/project/budget/item/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(itemData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentItems = get().budgetItems;
            set({ budgetItems: [...currentItems, data.data] });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Budget item creation failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Budget item creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      // Update Budget Item
      updateBudgetItem: async (itemId, itemData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/project/budget/item/update/${itemId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(itemData),
          });
          const data = await res.json();

          if (data.responseCode === "00" && data.data) {
            const currentItems = get().budgetItems;
            const updatedItems = currentItems.map(item => 
              item.id === itemId ? { ...item, ...data.data } : item
            );
            set({ budgetItems: updatedItems });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Budget item update failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Budget item update failed" };
        } finally {
          set({ loading: false });
        }
      },

      // Delete Budget Item
      deleteBudgetItem: async (itemId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/project/budget/item/delete/${itemId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (data.responseCode === "00") {
            const currentItems = get().budgetItems;
            const filteredItems = currentItems.filter(item => item.id !== itemId);
            set({ budgetItems: filteredItems });
            return { success: true, data: data.data, message: data.message };
          } else {
            return { 
              success: false, 
              error: data.message || "Budget item deletion failed",
              errors: data.errors || []
            };
          }
        } catch (error) {
          return { success: false, error: "Budget item deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearBudgets: () => {
        set({
          budgets: [],
          budgetItems: [],
          loading: false,
        });
      },
    }),
    {
      name: "budget-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);