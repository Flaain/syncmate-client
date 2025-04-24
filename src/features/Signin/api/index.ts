import { api } from '@/shared/api';
import { Profile } from '@/shared/model/types';

import { SigninSchemaType } from '../model/schema';

export const signinApi = {
    signin: (body: SigninSchemaType) => api.post<Profile>('/auth/signin', body)
};