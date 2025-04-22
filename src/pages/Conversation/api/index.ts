import { IMessage } from "@/entities/message";

import { api } from "@/shared/api";
import { DataWithCursor } from "@/shared/model/types";

import { Conversation } from "../model/types";

export const conversationApi = {
    create: (body: { recipientId: string }) => api.post<{ _id: string; lastMessageSentAt: string }>('/conversation/create', body),
    get: (recipientId: string, signal?: AbortSignal) => api.get<Conversation>(`/conversation/${recipientId}`, { signal }),
    getPreviousMessages: (recipientId: string, cursor: string, signal?: AbortSignal) => api.get<DataWithCursor<IMessage>>(`/conversation/previous-messages/${recipientId}`, { params: { cursor }, signal }),
    delete: (recipientId: string) => api.delete<{ conversationId: string }>(`/conversation/delete/${recipientId}`)
}