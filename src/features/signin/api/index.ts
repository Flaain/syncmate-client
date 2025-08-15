import { api } from '@/shared/api';
import { Profile } from '@/shared/model/types';

import { SigninData } from '../model/schema';
import { SigninWithTFA } from '../model/type';

export const signinApi = {
    signin: (body: SigninData) => api.post<Profile | SigninWithTFA>('/auth/signin', body)
};