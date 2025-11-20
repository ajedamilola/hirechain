import HTTP from "@/lib/http";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  fullUserData: UserProfileData | null;
  isLoading: boolean;
  authenticatedAccountId: string | null;

  setIsAuthenticated: (value: boolean) => void;
  setProfile: (profile: UserProfile | null) => void;
  setFullUserData: (fullUserData: UserProfileData | null) => void;
  setLoading: (value: boolean) => void;
  setAuthenticatedAccountId: (value: string | null) => void;
  fetchAuthenticatedUser: (accountId: string) => Promise<void>;
  fetchFullUserData: (accountId: string) => Promise<UserProfileData | null>;
  logout: () => void;
};

export const useStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: null,
      fullUserData: null,
      isLoading: false,
      authenticatedAccountId: null,

      setIsAuthenticated: (value) => set({ isAuthenticated: value }),

      setProfile: (profile) => set({ profile }),

      setFullUserData: (fullUserData) => set({ fullUserData }),

      setLoading: (value) => set({ isLoading: value }),

      setAuthenticatedAccountId: (value) =>
        set({ authenticatedAccountId: value }),

      fetchAuthenticatedUser: async (accountId) => {
        if (!accountId) {
          console.error("No accountId provided");
          return;
        }

        set({ isLoading: true });

        try {
          const response = await HTTP.get(`/api/users/profile/${accountId}`);

          if (response.data) {
            set({
              isAuthenticated: true,
              profile: response.data as UserProfile,
              authenticatedAccountId: accountId
            });
          } else {
            set({
              isAuthenticated: false,
              profile: null
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({
            isAuthenticated: false,
            profile: null
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchFullUserData: async (accountId) => {
        if (!accountId) {
          console.error("No accountId provided");
          return null;
        }

        set({ isLoading: true });

        try {
          const { data, err } = await HTTP.get(`/api/freelancers/${accountId}`);

          if (!err && data) {
            const fullData = data as UserProfileData;
            set({
              fullUserData: fullData,
              profile: fullData.profile,
              isAuthenticated: true,
              authenticatedAccountId: accountId
            });
            return fullData;
          } else {
            console.error("Error fetching full user data:", err);
            return null;
          }
        } catch (error) {
          console.error("Error fetching full user data:", error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          profile: null,
          fullUserData: null,
          authenticatedAccountId: null
        });
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authenticatedAccountId: state.authenticatedAccountId,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
