import { api } from '@/shared/api';
import { Pagination, WrappedInPagination } from '@/shared/model/types';
import { LocalResults } from '../model/types';
import { GroupGlobalFeed, UserFeed } from '@/widgets/Feed/types';

export const sidebarApi = {
    search: ({ query, page = 0, limit = 10 }: Pagination) => api.get<WrappedInPagination<UserFeed | GroupGlobalFeed>>('/feed/search', { params: { query, page, limit } }),
    get: () => api.get<LocalResults>('/feed')
};