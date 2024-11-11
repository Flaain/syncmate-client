import { api } from '@/shared/api';
import { CreateGroupParams } from '../model/types';

export const createGroupApi = {
    create: (params: CreateGroupParams) => api.post<{ _id: string }>('/group/create', params)
};