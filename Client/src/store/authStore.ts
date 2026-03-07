import { create } from "zustand";

export interface AuthUser {
    clientId: string;
    companyName: string;
    contactPerson: string;
    email: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (clientId: string, password: string) => boolean;
    logout: () => void;
    initialize: () => void;
}

const MOCK_CREDENTIALS = {
    clientId: "CL102",
    password: "manakamana123",
    user: {
        clientId: "CL102",
        companyName: "ABC Traders Pvt. Ltd.",
        contactPerson: "Ram Sharma",
        email: "abc@gmail.com",
    },
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    login: (clientId: string, password: string) => {
        if (
            clientId === MOCK_CREDENTIALS.clientId &&
            password === MOCK_CREDENTIALS.password
        ) {
            set({ user: MOCK_CREDENTIALS.user, isAuthenticated: true });
            if (typeof window !== "undefined") {
                localStorage.setItem("mk_auth_user", JSON.stringify(MOCK_CREDENTIALS.user));
            }
            return true;
        }
        return false;
    },

    logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
            localStorage.removeItem("mk_auth_user");
        }
    },

    initialize: () => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("mk_auth_user");
            if (stored) {
                try {
                    const parsedUser = JSON.parse(stored);
                    set({ user: parsedUser, isAuthenticated: true, isInitialized: true });
                    return;
                } catch {
                    // ignore parse errors
                }
            }
        }
        set({ isInitialized: true });
    }
}));
