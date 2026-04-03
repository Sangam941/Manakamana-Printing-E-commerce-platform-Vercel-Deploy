import api from "./axios";

// Submit a design
export const submitDesignApi = async (formData:FormData): Promise<any> => {
    try {
        // If designData is FormData, do not set Content-Type (browser will handle multipart)
        const response = await api.post('/v1/design-submissions', formData, {headers: {
            "Content-Type": "multipart/form-data",
        },});
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all submitted design by ID
export const getAllDesign = async () => {
    try {
        const response = await api.get(`/v1/design-submissions/my`);
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};
// Fetch approved design by ID
export const approvedDesign = async (id:string) => {
    try {
        const response = await api.get(`/v1/client/designs/${id}`);
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};


// Verify the design by designCode
export const verifyDesign = async (designId: string): Promise<any> => {
    try {
        const response = await api.post(`/v1/designs/verify`, {designId});
        console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

