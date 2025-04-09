import { api } from '@/shared/api';
import { ApiBaseSuccessData } from '@/shared/api/API';
import { GetSessionsReturn } from '../model/types';

export const sessionApi = {
    logout: () => api.get<ApiBaseSuccessData>('/auth/logout', { keepalive: true }),
    getSessions: (signal?: AbortSignal) => api.get<GetSessionsReturn>('/session', { signal }),
    dropSession: (sessionId: string) => api.delete<ApiBaseSuccessData>(`/session/${sessionId}`),
    terminateAllSessions: () => api.delete<{ acknowledged: boolean; deletedCount: number }>('/session')
};