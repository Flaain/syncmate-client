import { SignupSchemaType } from '../model/types';
import { Profile } from '@/entities/profile/model/types';
import { api } from '@/shared/api';
import { UserCheckParams } from '@/shared/model/types';

export const signupApi = {
    signup: (body: Omit<SignupSchemaType, 'confirmPassword'>) => api.post<Profile>('/auth/signup', body),
    check: ({ type }: UserCheckParams) => api.get('/user/check', { params: { type } })
};