import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8005";

const api = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;

  // Prefer Zustand persisted auth token (single source of truth).
  const authStorageRaw = localStorage.getItem("auth-storage");
  if (authStorageRaw) {
    try {
      const parsed = JSON.parse(authStorageRaw);
      const token = parsed?.state?.token;
      if (typeof token === "string" && token.length > 0) {
        return token;
      }
    } catch {
      // Ignore malformed storage and fall back to legacy key.
    }
  }

  // Backward-compatible fallback.
  const authUserRaw = localStorage.getItem("authUser");
  if (authUserRaw) {
    try {
      const parsed = JSON.parse(authUserRaw);
      const token = parsed?.token;
      if (typeof token === "string" && token.length > 0) {
        return token;
      }
    } catch {
      return null;
    }
  }

  return null;
};


api.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url ?? "";
    const isAuthRoute = String(requestUrl).includes("/v1/auth/login");
    const hasAuthHeader = Boolean(
      error?.config?.headers?.Authorization || error?.config?.headers?.authorization
    );

    // Only force logout when an authenticated request gets rejected.
    if (status === 401 && hasAuthHeader && !isAuthRoute && typeof window !== "undefined") {
      localStorage.removeItem("authUser");
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("profile-storage");
      localStorage.removeItem("wallet-storage");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
