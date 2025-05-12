import { api, ApiBaseSuccessData } from '@/shared/api';
import { Avatar, Pagination, Profile, WrappedInPagination } from '@/shared/model/types';

import { EditProfile, SearchUser } from '../model/types';

export const profileApi = {
    getProfile: () => api.get<Profile>('/auth/me'),
    avatar: (form: FormData) => api.post<Avatar>('/user/avatar', form),
    edit: (data: EditProfile, signal?: AbortSignal) => api.patch<EditProfile>('/user/edit', data, { signal }),
    search: ({ query, page = 0, limit = 10 }: Pagination) => api.get<WrappedInPagination<SearchUser>>('/user/search', { params: { query, page, limit } }),
    block: ({ recipientId }: { recipientId: string }) => api.post<ApiBaseSuccessData>(`/user/block/${recipientId}`),
    unblock: ({ recipientId }: { recipientId: string }) => api.post<ApiBaseSuccessData>(`/user/unblock/${recipientId}`)
}