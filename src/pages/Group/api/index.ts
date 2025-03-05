import { api } from '@/shared/api';
import { Group, GroupParticipant } from '../model/types';
import { DataWithCursor } from '@/shared/model/types';

export const groupApi = {
    get: (id: string, signal?: AbortSignal) => api.get<Group>(`/group/${id}`, { signal }),
    participants: (id: string, signal?: AbortSignal, cursor?: string | null) => api.get<DataWithCursor<GroupParticipant>>(`/group/${id}/participants`, { 
        signal, 
        params: { cursor } 
    })
};
