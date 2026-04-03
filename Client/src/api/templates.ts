import type { TemplateCategory } from "@/store/useTemplateStore";
import api from "./axios";

// Fetch all template categories
export const fetchTemplateCategories = async () => {
    try {
        const response = await api.get('/v1/templates/categories');
        console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all templates
export const fetchAllTemplates = async (): Promise<TemplateCategory[]> => {
    try {
        const response = await api.get('/v1/templates');
        console.log(response.data.data.items)
        return response.data.data.items;
    } catch (error) {
        throw error;
    }
};

// Fetch a template by ID
// export const fetchTemplateById = async (id: string): Promise<Template | null> => {
//     try {
//         const response = await api.get(`/v1/templates/${id}`);
//         console.log(response.data)
//         // return response.data;
//     } catch (error) {
//         throw error;
//     }
// };