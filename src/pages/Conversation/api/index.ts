import { api } from "@/shared/api";

import { Conversation } from "../model/types";

export const conversationApi = {
    create: (body: { recipientId: string }) => api.post<{ _id: string; lastMessageSentAt: string }>('/conversation/create', body),
    get: (recipientId: string, signal?: AbortSignal) => api.get<Conversation>(`/conversation/${recipientId}`, { signal }),
    getPreviousMessages: (recipientId: string, cursor: string, signal?: AbortSignal) => api.get<Conversation['messages']>(`/conversation/previous-messages/${recipientId}`, { params: { cursor }, signal }),
    delete: (recipientId: string) => api.delete<{ conversationId: string }>(`/conversation/delete/${recipientId}`)
}