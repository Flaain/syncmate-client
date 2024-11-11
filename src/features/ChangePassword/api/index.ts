import { UserPasswordParams } from '../model/types';
import { api } from '@/shared/api';

export const changePasswordAPI = {
    changePassword: ({ type, ...body }: UserPasswordParams) => api.post(`/auth/password`, body, { params: { type } })
};