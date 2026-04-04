import api from "./axios";
import type { User } from "@/types";

// Fetch the current user's profile
export const getProfile = async (): Promise<User> => {
    try {
        const response = await api.get('/v1/user/profile');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Edit or update the user's profile
export const editProfile = async (updates: Partial<User>): Promise<User> => {
    try {
        const response = await api.patch('/v1/user/profile', updates);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};