import { api, ApiBaseSuccessData } from '@/shared/api';
import { Message } from '@/shared/model/types';

import { DefaultParamsAPI, DeleteParamsAPI } from '../model/types';

export const messageApi = {
    send: ({ endpoint, body, signal }: DefaultParamsAPI) => api.post<Message>(endpoint, body, { signal }),
    edit: ({ endpoint, body }: DefaultParamsAPI) => api.patch<Message>(endpoint, body),
    reply: ({ endpoint, body }: DefaultParamsAPI) => api.post<Message>(endpoint, body),
    delete: ({ endpoint, messageIds }: DeleteParamsAPI) => api.delete<Array<string>>(endpoint, { params: { messageIds } }),
    read: ({ endpoint, body }: DefaultParamsAPI) => api.patch<ApiBaseSuccessData>(endpoint, body, { keepalive: true })
};