import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      isNotificationEnabled: false,
      isNotificationPanelOpen: false,
      
      notifications: [],
      loading: false,
      lastFetch: null,

      toggleNotificationEnable: () => 
        set((state) => ({ isNotificationEnabled: !state.isNotificationEnabled })),
      
      toggleNotificationPanel: () => 
        set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),
      
      closeNotificationPanel: () => 
        set({ isNotificationPanelOpen: false }),
      
      markAllAsRead: async () => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (accessToken) {
          try {
            await fetch(`${SERVER_API}/notifications/mark-all-read`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error("Failed to sync mark all as read:", error);
          }
        }
        
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true }))
        }));
      },
      
      unmarkAllAsRead: async () => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (accessToken) {
          try {
            await fetch(`${SERVER_API}/notifications/unmark-all-read`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error("Failed to sync unmark all as read:", error);
          }
        }
        
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: false }))
        }));
      },
      
      addNotification: (notification) => 
        set((state) => ({
          notifications: [...state.notifications, { ...notification, read: false, id: notification.id || Date.now() }]
        })),
      
      removeNotification: async (id) => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (accessToken) {
          try {
            await fetch(`${SERVER_API}/notifications/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error("Failed to delete notification from backend:", error);
          }
        }
        
        set((state) => ({
          notifications: state.notifications.filter(notif => notif.id !== id)
        }));
      },

      markAsRead: async (id) => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (accessToken) {
          try {
            await fetch(`${SERVER_API}/notifications/${id}/read`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error("Failed to mark notification as read:", error);
          }
        }
        
        set((state) => ({
          notifications: state.notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
          )
        }));
      },

      clearAllNotifications: async () => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (accessToken) {
          try {
            await fetch(`${SERVER_API}/notifications/clear-all`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error("Failed to clear notifications from backend:", error);
          }
        }
        
        set({ notifications: [] });
      },

      fetchNotifications: async () => {
        const { accessToken } = useAuthStore.getState().tokens || {};
        
        if (!accessToken) return { success: false, error: "No access token" };
        
        set({ loading: true });
        try {
          const res = await fetch(`${SERVER_API}/notifications`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ 
              notifications: data.data,
              lastFetch: Date.now(),
              loading: false
            });
            return { success: true, data: data.data };
          }

          set({ loading: false });
          return { success: false, data };
        } catch (error) {
          set({ loading: false });
          return { success: false, error: "Failed to fetch notifications" };
        }
      },

      fetchNotificationsIfStale: async () => {
        const { lastFetch } = get();
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        if (!lastFetch || lastFetch < fiveMinutesAgo) {
          return await get().fetchNotifications();
        }
        return { success: true, cached: true };
      },

      setNotifications: (notifications) => set({ notifications }),
      setLoading: (loading) => set({ loading }),

      addTemplate: async (templateData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/notifications/public/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(templateData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentNotifications = get().notifications;
            set({ notifications: [...currentNotifications, { ...data.data, read: false, id: data.data._id || Date.now() }] });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Template creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      clearNotifications: () => {
        set({
          notifications: [],
          loading: false,
        });
      },

      clearNotificationData: () => {
        set({
          isNotificationEnabled: false,
          isNotificationPanelOpen: false,
          notifications: [],
          loading: false,
          lastFetch: null,
        });
      },

      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter(notif => !notif.read).length;
      },
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isNotificationEnabled: state.isNotificationEnabled,
        notifications: state.notifications,
        lastFetch: state.lastFetch,
      }),
    }
  )
);