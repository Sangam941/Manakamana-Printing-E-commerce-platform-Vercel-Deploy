import axios from "axios";

export const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8005";

const api = axios.create({
  baseURL: `${baseUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("authUser");

  if (auth) {
    const { token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
