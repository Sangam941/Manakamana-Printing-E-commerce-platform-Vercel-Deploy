import { fetchAllServices } from '@/api/services';
import { create } from 'zustand';

type Service = {
  id: string;
  name: string;
  description: string;
  image?:string;
  basePrice: number;
  isActive: boolean;
};

type ServicesStore = {
  services: Service[];
  fetchServices: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  loading: false,
  error: null,
  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAllServices();
      set({
        services: Array.isArray(data) ? (data as unknown as Service[]) : [],
      });
    } catch (error: any) {
      set({ error: error?.message || "Unknown error", loading: false });
    }
  },
}));