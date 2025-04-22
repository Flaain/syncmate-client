import { api } from '@/shared/api';
import { Profile, UserCheckParams } from '@/shared/model/types';

import { SignupSchemaType } from '../model/types';

export const signupApi = {
    signup: (body: Omit<SignupSchemaType, 'confirmPassword'>) => api.post<Profile>('/auth/signup', body),
    check: (params: UserCheckParams) => api.get('/user/check', { params })
};