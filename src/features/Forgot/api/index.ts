import { api } from '@/shared/api';
import { ApiBaseSuccessData } from '@/shared/api/API';

export const forgotAPI = {
    reset: (body: { email: string; otp: string; password: string }) => api.post<ApiBaseSuccessData>('/auth/reset', body)
};