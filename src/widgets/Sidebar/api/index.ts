import { api } from '@/shared/api';
import { Pagination, WrappedInPagination } from '@/shared/model/types';
import { UserFeed } from '@/widgets/Feed/model/types';
import { LocalResults } from '../model/types';

export const sidebarApi = {
    search: ({ query, page = 0, limit = 10, signal }: Pagination & { signal?: AbortSignal }) => api.get<WrappedInPagination<UserFeed>>('/feed/search', { params: { query, page, limit }, signal }),
    get: (signal?: AbortSignal) => api.get<LocalResults>('/feed', { signal })
};