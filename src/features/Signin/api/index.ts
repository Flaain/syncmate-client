import { api } from '@/shared/api';
import { SigninSchemaType } from '../model/types';
import { Profile } from '@/entities/profile/model/types';

export const signinApi = {
    signin: (body: SigninSchemaType) => api.post<Profile>('/auth/signin', body)
};