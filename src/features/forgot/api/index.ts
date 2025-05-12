import { api, ApiBaseSuccessData } from '@/shared/api';

export const forgotAPI = {
    reset: (body: { email: string; otp: string; password: string }) => api.post<ApiBaseSuccessData>('/auth/reset', body)
};