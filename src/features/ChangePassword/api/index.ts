import { ApiBaseSuccessData } from '@/shared/api/API';
import { UserPasswordParams } from '../model/types';
import { api } from '@/shared/api';

export const changePasswordAPI = {
    changePassword: ({ type, ...body }: UserPasswordParams) => api.post<ApiBaseSuccessData>(`/auth/password`, body, { params: { type } })
};