import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { toast } from 'sonner';
import { useSocket } from '@/shared/model/store';
import { redirect } from 'react-router-dom';
import { SetStateInternal } from '@/shared/model/types';
import { conversationApi } from '../api';
import { ApiException } from '@/shared/api/error';
import { ChatStore } from '@/shared/lib/providers/chat/types';

export const conversationActions = (set: SetStateInternal<ConversationStore>, get: () => ConversationStore, setChat: SetStateInternal<ChatStore>): ConversationStore['actions'] => ({
    getConversation: async (action: 'init' | 'refetch', recipientId: string, abortController?: AbortController) => {
        try {
            action === 'init' ? set({ status: 'loading' }) : set({ isRefetching: true });
            
            const { data } = await conversationApi.get(recipientId, abortController?.signal);

            set({ data, status: 'idle', error: null });

            setChat({
                params: {
                    apiUrl: '/message',
                    id: data.conversation.recipient._id,
                    query: { recipientId: data.conversation.recipient._id },
                    type: 'conversation'
                }
            })
        } catch (error) {
            console.error(error);

            error instanceof ApiException && (error.response.status === 404 ? redirect('/') : set({ error: error.message, status: 'error' }));
        } finally {
            set({ isRefetching: false });
        }
    },
    getPreviousMessages: async () => {
        try {
            setChat({ isPreviousMessagesLoading: true });

            const { data: { conversation: { recipient }, nextCursor } } = get();
            const { data } = await conversationApi.getPreviousMessages(recipient._id, nextCursor!);

            set((prevState) => ({
                data: {
                    ...prevState.data,
                    conversation: {
                        ...prevState.data.conversation,
                        messages: [...data.messages, ...prevState.data.conversation.messages]
                    },
                    nextCursor: data.nextCursor
                }
            }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot get previous messages', { position: 'top-center' });
        } finally {
            setChat({ isPreviousMessagesLoading: false });
        }
    },
    handleTypingStatus: () => {
        const ctx: { isTyping: boolean, typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return (reset?: boolean) => {
            if (reset) {
                ctx.isTyping = false;
                clearTimeout(ctx.typingTimeout!);
                return;
            }

            const { data: { conversation } } = get();
            const { socket } = useSocket.getState();
    
            const typingData = { conversationId: conversation._id, recipientId: conversation.recipient._id };

            if (!ctx.isTyping) {
                ctx.isTyping = true; 
                socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData);
            } else {
                clearTimeout(ctx.typingTimeout!);
            }
    
            ctx.typingTimeout = setTimeout(() => {
                ctx.isTyping = false;
                socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
            }, 5000);
        }
    },
});