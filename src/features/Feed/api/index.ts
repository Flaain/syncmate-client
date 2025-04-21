import { api } from "@/shared/api";
import { Pagination, WrappedInPagination } from "@/shared/model/types";

import { GlobalFeed, LocalResults } from "../model/types";

export const feedApi = {
    search: ({ query, page = 0, limit = 10, signal }: Pagination & { signal?: AbortSignal }) => api.get<WrappedInPagination<GlobalFeed>>('/feed/search', { params: { query, page, limit }, signal }),
    get: (signal?: AbortSignal) => api.get<LocalResults>('/feed', { signal })
};