import { api } from '@/shared/api';
import { DefaultParamsAPI, DeleteParamsAPI, Message } from '../model/types';

export const messageApi = {
    send: <T = Message>({ endpoint, body, signal }: DefaultParamsAPI) => api.post<T>(endpoint, body, { signal }),
    edit: <T = Message>({ endpoint, body }: DefaultParamsAPI) => api.patch<T>(endpoint, body),
    reply: <T = Message>({ endpoint, body }: DefaultParamsAPI) => api.post<T>(endpoint, body),
    delete: <T = Message>({ endpoint, messageIds }: DeleteParamsAPI) => api.delete<T>(endpoint, { params: { messageIds } })
};