import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const API_VERSION = 'v1';

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/${API_VERSION}`,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        let token: string | null = null;
        if (typeof window !== 'undefined') {
            token = window.localStorage.getItem('access_token');
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers["Access-Control-Allow-Origin"] = "*";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        try {
            const respData: any = error.response?.data;
            if (respData && typeof respData.message === 'string' && respData.message.includes('insufficient_fish_balance')) {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('insufficient_fish_balance', '1');
                }
            }
        } catch {
            // ignore
        }
        return Promise.reject(error);
    }
);

export { API_BASE_URL, API_VERSION };
export default axiosInstance;
