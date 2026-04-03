import { approvedDesign, getAllDesign, submitDesignApi, verifyDesign } from "@/api/design";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DesignStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Design {
    id: string;
    designCode: string;
    clientId: string;
    fileUrl: string;
    previewUrl: string | null;
    status: DesignStatus;
    rejectionReason: string | null;
    reviewedById: string | null;
    createdAt: string;
    reviewedAt: string | null;
}

export interface DesignStoreState {
    designs: Design[];
    loading: boolean;
    error: string | null;
    fetchAllDesigns: () => Promise<void>;
    submitDesign: (formData: FormData) => Promise<void>
    // fetchApprovedDesigns: (id:string) => Promise<void>;
    verifyDesign: (designCode: string) => Promise<Design | undefined>;
    clearDesigns: () => void;
}

export const useDesignStore = create<DesignStoreState>()(
    persist(
        (set, get) => ({
            designs: [],
            loading: false,
            error: null,

            fetchAllDesigns: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await getAllDesign()
                    set({ designs: data, error: null });
                } catch (error: any) {
                    set({ error: error?.message || "Failed to fetch designs" });
                } finally {
                    set({ loading: false });
                }
            },

            submitDesign: async (formData:FormData) => {
                set({ loading: true, error: null });
                try {
                    const designSubmitted = await submitDesignApi(formData)
                    set((state) => ({
                        designs: [...state.designs, designSubmitted],
                        error: null
                    }));
                    
                } catch (error: any) {
                    set({ error: error?.message || "Failed to submit design" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            // fetchApprovedDesigns: async (id: string) => {
            //     set({ loading: true, error: null });
            //     try {
            //         const data = await approvedDesign(id);
            //         // Filter the approved design(s) from returned data if data is an array,
            //         // otherwise wrap the single object in an array if it's just one approved design.
            //         let approvedDesigns: Design[] = [];
            //         if (Array.isArray(data)) {
            //             approvedDesigns = data.filter((design: Design) => design.status === 'approved');
            //         } else if (data && data.status === 'approved') {
            //             approvedDesigns = [data];
            //         }
            //         set({ designs: approvedDesigns, error: null });
            //     } catch (error: any) {
            //         set({ error: error?.message || "Failed to fetch approved designs" });
            //     } finally {
            //         set({ loading: false });
            //     }
            // },

            verifyDesign: async (designCode: string, newPreviewUrl?: string) => {
                set({ loading: true, error: null });
                try {
                    await verifyDesign(designCode);
                } catch (error: any) {
                    set({ error: error?.message || "Failed to verify design" });
                    return undefined;
                } finally {
                    set({ loading: false });
                }
            },

            clearDesigns: () => {
                set({ designs: [], error: null, loading: false });
            }
        }),
        {
            name: "design-storage",
        }
    )
);