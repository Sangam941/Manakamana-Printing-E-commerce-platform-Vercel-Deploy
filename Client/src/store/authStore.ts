import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type { User } from "../types";
import { loginUser } from "@/api/auth";

export interface AuthUser {
    clientId: string;
    role: string;
    token: string;
}


export interface AuthStoreState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    isHydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: false,
            isHydrated: false,

            setHasHydrated: (state: boolean) => {
                set({ isHydrated: state });
            },

            login: async (email: string, password: string) => {
                set({ loading: true });
                try {
                    const data = await loginUser(email, password);
                    const authUser = {
                        ...(data.client ?? data.user),
                    };

                    set({
                        isAuthenticated: true,
                        user: authUser,
                        token: data.token,
                    });

                    localStorage.setItem("authUser", JSON.stringify({
                        ...authUser,
                        token: data.token,
                    }));
                    toast.success("Login successful!");
                } catch (error) {
                    toast.error("Invalid email or password");
                    set({
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw new Error("Invalid credentials");
                } finally {
                    set({ loading: false });
                }
            },

            logout: () => {
                set({ isAuthenticated: false, user: null, token: null });
                localStorage.removeItem("authUser");
                toast.success("Logged out successfully!");
            },
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
