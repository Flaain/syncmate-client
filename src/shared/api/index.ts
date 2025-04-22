import { OtpType } from '../model/types';

import { API, ApiBaseSuccessData } from './API';

export { ApiException } from './error'
export { type ApiBaseSuccessData } from './API';

export const api = new API({ baseUrl: import.meta.env.VITE_BASE_URL, credentials: 'include' });

export const otpApi = {
    create: (body: { email: string; type: OtpType }) => api.post<{ retryDelay: number }>('/auth/otp', body),
    verify: (body: { otp: string; email: string; type: OtpType }) => api.post<ApiBaseSuccessData>('/auth/otp/verify', body)
};