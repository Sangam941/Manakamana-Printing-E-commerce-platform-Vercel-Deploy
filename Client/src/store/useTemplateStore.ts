import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchAllTemplates, fetchTemplateCategories } from "@/api/templates";

export interface TemplateCategory {
    id: string;
    name: string;
    slug: string;
}

export interface TemplateWithCategory {
    id: string;
    title?: string;
    description?: string;
    categoryId: string;
    fileUrl: string;
    isActive: boolean;
    category: TemplateCategory;
}

export interface TemplateStoreState {
    category: TemplateCategory[];
    templates: TemplateWithCategory[];
    selectedTemplate: TemplateWithCategory | null;
    loading: boolean;
    error: string | null;
    getCategories: () => Promise<void>;
    getAllTemplates: () => Promise<void>;
    // getTemplateById: (id: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateStoreState>()(
    persist(
        (set, get) => ({
            category: [],
            templates: [],
            selectedTemplate: null,
            loading: false,
            error: null,

            getCategories: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await fetchTemplateCategories()
                    set({ category: Array.isArray(data) ? data : [], error: null });
                } catch (error: any) {
                    set({ error: error?.message || "Failed to fetch categories" });
                } finally {
                    set({ loading: false });
                }
            },

            getAllTemplates: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await fetchAllTemplates()
                    set({ templates: Array.isArray(data) ? (data as unknown as TemplateWithCategory[]) : [], error: null });
                } catch (error: any) {
                    set({ error: error?.message || "Failed to fetch templates" });
                } finally {
                    set({ loading: false });
                }
            },

            // getTemplateById: async (id: string) => {
            //     set({ loading: true, error: null });
            //     try {
            //         const data = await fetchTemplateById(id)
            //         set({ selectedTemplate: data, error: null });
            //     } catch (error: any) {
            //         set({ error: error?.message || "Failed to fetch template" });
            //     } finally {
            //         set({ loading: false });
            //     }
            // },
        }),
        {
            name: "template-storage",
        }
    )
);