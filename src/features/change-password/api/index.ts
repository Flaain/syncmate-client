import { api, ApiBaseSuccessData } from '@/shared/api';

import { UserPasswordParams } from '../model/types';

export const changePasswordAPI = {
    changePassword: ({ type, ...body }: UserPasswordParams) => api.post<ApiBaseSuccessData>(`/auth/password`, body, { params: { type } })
};