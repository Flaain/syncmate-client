import { ApiBaseSuccessData } from '@/shared/api/API';
import { GetSessionsReturn } from '../model/types';
import { api } from '@/shared/api';

export const sessionApi = {
    logout: () => api.get<ApiBaseSuccessData>('/auth/logout', { keepalive: true }),
    getSessions: () => api.get<GetSessionsReturn>('/session'),
    dropSession: (sessionId: string) => api.delete<ApiBaseSuccessData>(`/session/${sessionId}`),
    terminateAllSessions: () => api.delete<{ acknowledged: boolean; deletedCount: number }>('/session')
};