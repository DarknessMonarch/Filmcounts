import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useOrgStore = create(
  persist(
    (set, get) => ({
      organizations: [],
      currentOrg: null,
      invitations: [],
      orgInvitations: [],
      loading: false,

      setOrganizations: (organizations) => set({ organizations }),
      setCurrentOrg: (currentOrg) => set({ currentOrg }),
      setInvitations: (invitations) => set({ invitations }),
      setOrgInvitations: (orgInvitations) => set({ orgInvitations }),
      setLoading: (loading) => set({ loading }),

      createOrganization: async (orgData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(orgData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentOrgs = get().organizations;
            set({ organizations: [...currentOrgs, data.data] });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Organization creation failed" };
        } finally {
          set({ loading: false });
        }
      },

      updateOrganization: async (orgId, orgData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/update/${orgId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(orgData),
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const currentOrgs = get().organizations;
            const updatedOrgs = currentOrgs.map(org => 
              org._id === orgId ? { ...org, ...data.data } : org
            );
            set({ organizations: updatedOrgs });

            const currentOrg = get().currentOrg;
            if (currentOrg && currentOrg._id === orgId) {
              set({ currentOrg: { ...currentOrg, ...data.data } });
            }
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Organization update failed" };
        } finally {
          set({ loading: false });
        }
      },

      deleteOrganization: async (orgId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/delete/${orgId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentOrgs = get().organizations;
            const filteredOrgs = currentOrgs.filter(org => org._id !== orgId);
            set({ organizations: filteredOrgs });

            const currentOrg = get().currentOrg;
            if (currentOrg && currentOrg._id === orgId) {
              set({ currentOrg: null });
            }
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Organization deletion failed" };
        } finally {
          set({ loading: false });
        }
      },

      sendInvitation: async (invitationData) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/invitation/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(invitationData),
          });
          const data = await res.json();

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Invitation sending failed" };
        } finally {
          set({ loading: false });
        }
      },

      getMyInvitations: async () => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/invitation/mine`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ invitations: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch invitations" };
        } finally {
          set({ loading: false });
        }
      },

      getOrgInvitations: async (orgId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/invitation/organization/${orgId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            set({ orgInvitations: data.data });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to fetch organization invitations" };
        } finally {
          set({ loading: false });
        }
      },

      acceptInvitation: async (invitationId) => {
        set({ loading: true });
        try {
          const { accessToken } = useAuthStore.getState().tokens || {};
          
          if (!accessToken) {
            return { success: false, error: "No access token available" };
          }

          const res = await fetch(`${SERVER_API}/org/invitation/accept/${invitationId}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await res.json();

          if (res.ok) {
            const currentInvitations = get().invitations;
            const filteredInvitations = currentInvitations.filter(
              inv => inv._id !== invitationId
            );
            set({ invitations: filteredInvitations });
          }

          return { success: res.ok, data };
        } catch (error) {
          return { success: false, error: "Failed to accept invitation" };
        } finally {
          set({ loading: false });
        }
      },

      clearOrgData: () => {
        set({
          organizations: [],
          currentOrg: null,
          invitations: [],
          orgInvitations: [],
          loading: false,
        });
      },
    }),
    {
      name: "org-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);