import { api } from '@/shared/api';
import { Avatar, Profile } from '../model/types';
import { ApiBaseSuccessData } from '@/shared/api/API';
import { Pagination, WrappedInPagination } from '@/shared/model/types';
import { SearchUser } from '@/widgets/Feed/types';

export const profileApi = {
    getProfile: () => api.get<Profile>('/auth/me'),
    avatar: (form: FormData) => api.post<Avatar>('/user/avatar', form),
    status: (body: { status: string }) => api.post<ApiBaseSuccessData>('/user/status', body),
    name: (body: { name: string }) => api.post<ApiBaseSuccessData>('/user/name', body),
    search: ({ query, page = 0, limit = 10 }: Pagination) => api.get<WrappedInPagination<SearchUser>>('/user/search', { params: { query, page, limit } }),
    block: ({ recipientId }: { recipientId: string }) => api.post<ApiBaseSuccessData>(`/user/block/${recipientId}`),
    unblock: ({ recipientId }: { recipientId: string }) => api.post<ApiBaseSuccessData>(`/user/unblock/${recipientId}`)
}