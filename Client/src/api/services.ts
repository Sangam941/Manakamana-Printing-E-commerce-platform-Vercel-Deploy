import api from "./axios";
import type { Service } from "@/types";

// Fetch all services
export const fetchAllServices = async (): Promise<Service[]> => {
    try {
        const response = await api.get('/v1/services');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};