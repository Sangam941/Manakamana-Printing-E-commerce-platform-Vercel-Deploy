import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { editProfile, getProfile } from "@/api/profile";

export interface ProfileStoreState {
    profile: User | null;
    loading: boolean;
    error: string | null;
    fetchProfile: () => void;
    editProfile: (updates: Partial<User>) => void;
}

export const useProfileStore = create<ProfileStoreState>()(
    persist(
        (set, get) => ({
            profile: null,
            loading: false,
            error: null,

            fetchProfile: async () => {
                try {
                    const user = await getProfile();
                    set({ profile: user, error: null });
                } catch (error: any) {
                    set({ profile: null, error: error?.message || "Failed to fetch profile" });
                }
            },

            editProfile: async (updates: Partial<User>) => {
                try {
                    const updatedUser = await editProfile(updates);
                    set((state) => ({
                        profile: state.profile
                            ? {
                                ...state.profile,
                                business_name: updatedUser.business_name ?? state.profile.business_name,
                              }
                            : null,
                        error: null,
                    }));
                } catch (error: any) {
                    set((state) => ({
                        ...state,
                        error: error?.message || "Failed to update profile"
                    }));
                    throw error;
                }
            }
        }),
        {
            name: "profile-storage",
        }
    )
);