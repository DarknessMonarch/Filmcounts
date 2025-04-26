import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  isNotificationEnabled: false,
  isNotificationPanelOpen: false, 
  notifications: [], 
  
  toggleNotificationEnable: () => 
    set((state) => ({ isNotificationEnabled: !state.isNotificationEnabled })),
  
  toggleNotificationPanel: () => 
    set((state) => ({ isNotificationPanelOpen: !state.isNotificationPanelOpen })),
  
  closeNotificationPanel: () => 
    set({ isNotificationPanelOpen: false }),
  
  markAllAsRead: () => 
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true }))
    })),
  
  unmarkAllAsRead: () => 
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: false }))
    })),
  
  addNotification: (notification) => 
    set((state) => ({
      notifications: [...state.notifications, { ...notification, read: false }]
    })),
  
  removeNotification: (id) => 
    set((state) => ({
      notifications: state.notifications.filter(notif => notif.id !== id)
    })),
}));