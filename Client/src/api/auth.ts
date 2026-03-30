
import api from "./axios";

//register user

// Define RegisterCredentials type for registration
export type RegisterCredentials = {
    business_name: string;
    owner_name: string;
    email: string;
    phone_number: string;
    business_address: string;
    notes?: string;
};

export const registerUser = async(payload:RegisterCredentials)=>{
    try {
        const response = await api.post('/v1/register-request', payload)
        return response.data;
    } catch (error) {
        throw error
    }
}


//login user
export const loginUser = async(phone_number:string,password:string)=>{
    try {
        const response = await api.post('/v1/auth/login', {phone_number, password})
        return response.data;
    } catch (error) {
        throw error
    }
}
