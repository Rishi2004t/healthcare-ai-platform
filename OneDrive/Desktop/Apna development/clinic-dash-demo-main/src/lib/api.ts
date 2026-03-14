import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authApi = {
    signup: (data: any) => api.post('/auth/signup', data),
    verifyOtp: (data: { email: string; otp: string }) => api.post('/auth/verify-otp', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
};

export const reportApi = {
    createReport: (data: any) => api.post('/reports/create', data),
    getMyReports: () => api.get('/reports/my-reports'),
};

export const aiApi = {
    chat: (userId: number, message: string) => api.post('/ai/chat', { user_id: userId, message }),
    getHistory: () => api.get('/ai/history'),
};

export const consultationApi = {
    request: (data: {
        patient_name: string;
        age: number;
        symptoms: string;
        duration: string;
        doctor_name: string;
        medical_report_path?: string | null
    }) => api.post('/consultation/request', data),
    getMyRequests: () => api.get('/consultation/my-requests'),
    respond: (data: { consultation_id: number; advice: string }) => api.post('/consultation/respond', data),
};

export const doctorApi = {
    getDoctors: () => api.get('/doctors'),
    getReports: () => api.get('/doctor/reports'),
};

export const healthApi = {
    getDietPlan: (data: any) => api.post('/health/diet-plan', data),
};

export const diseaseApi = {
    search: (query: string) => api.get(`/diseases/search?q=${query}`),
};

export const medicineApi = {
    search: (query: string) => api.get(`/medicines/search?q=${query}`),
};

export const profileApi = {
    create: (data: any) => api.post('/patient/profile', data),
    get: () => api.get('/patient/profile'),
    update: (data: any) => api.put('/patient/profile', data),
};

export default api;
