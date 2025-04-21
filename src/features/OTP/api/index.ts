import { api } from '@/shared/api';
import { ApiBaseSuccessData } from '@/shared/api/API';

import { OtpType } from '../model/types';

export const otpApi = {
    create: (body: { email: string; type: OtpType }) => api.post<{ retryDelay: number }>('/auth/otp', body),
    verify: (body: { otp: string; email: string; type: OtpType }) => api.post<ApiBaseSuccessData>('/auth/otp/verify', body)
};