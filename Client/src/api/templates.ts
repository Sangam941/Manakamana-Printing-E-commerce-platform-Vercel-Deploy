import type { TemplateCategory } from "@/store/useTemplateStore";
import api from "./axios";

// Fetch all template categories
export const fetchTemplateCategories = async () => {
    try {
        const response = await api.get('/v1/templates/categories');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all templates
export const fetchAllTemplates = async (): Promise<TemplateCategory[]> => {
    try {
        const response = await api.get('/v1/templates');
        return response.data.data.items;
    } catch (error) {
        throw error;
    }
};

// Fetch a template by ID
// export const fetchTemplateById = async (id: string): Promise<Template | null> => {
//     try {
//         const response = await api.get(`/v1/templates/${id}`);
//         // return response.data;
//     } catch (error) {
//         throw error;
//     }
// };