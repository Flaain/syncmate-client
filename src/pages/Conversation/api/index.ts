import { Message } from "@/entities/Message/model/types";
import { Conversation, ConversationWithMeta } from "../model/types";
import { api } from "@/shared/api";

export const conversationApi = {
    create: (body: { recipientId: string }) => api.post<Pick<Conversation, '_id' | 'lastMessageSentAt'>>('/conversation/create', body),
    get: (recipientId: string, signal?: AbortSignal) => api.get<ConversationWithMeta>(`/conversation/${recipientId}`, { signal }),
    getPreviousMessages: (recipientId: string, cursor: string) => api.get<{ messages: Array<Message>, nextCursor: string | null }>(`/conversation/previous-messages/${recipientId}`, { params: { cursor } }),
    delete: (recipientId: string) => api.delete<{ conversationId: string }>(`/conversation/delete/${recipientId}`)
}