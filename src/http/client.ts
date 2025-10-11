import axios from "axios";
import { useAuthStore } from "../store";

const URL = import.meta.env.VITE_BACKEND_API_URL


export const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

// const refreshToken = () => api.post('/auth/refresh')
const refreshToken = async () => {
    await axios.post(`${URL}/auth/refresh`, {}, { withCredentials: true });
}

api.interceptors.response.use((response) => response, async(error) => {
    const originalRequest = error.config;

    if(error.response.status === 401 && !originalRequest._isRetry) {
        try{
            originalRequest._isRetry = true;
            const headers = { ...originalRequest.headers }
            await refreshToken()
            return api.request({...originalRequest, headers})
        }catch(err){
            console.error("Token refresh error: ", err);
            // logout the user
            useAuthStore.getState().logout();
            return Promise.reject(err);
        }
    }

    return Promise.reject(error)
})