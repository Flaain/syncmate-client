import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { toast } from 'sonner';
import { useSocket } from '@/shared/model/store';
import { redirect } from 'react-router-dom';
import { ActionsProvider } from '@/shared/model/types';
import { conversationApi } from '../api';
import { ApiException } from '@/shared/api/error';
import { SourceRefPath } from '@/entities/Message/model/types';
import { MessageFormState } from '@/features/SendMessage/model/types';

export const conversationActions = ({ set, get, setChat, getChat }: ActionsProvider<ConversationStore>): ConversationStore['actions'] => ({
    getConversation: async ({
        action,
        recipientId,
        abortController
    }: {
        action: 'init' | 'refetch';
        recipientId: string;
        abortController?: AbortController;
    }) => {
        try {
            action === 'refetch' && set({ isRefetching: true });

            const { data } = await conversationApi.get(recipientId, abortController?.signal);

            set({ conversation: data.conversation, status: 'idle', error: null, isRefetching: false });

            setChat({
                params: {
                    id: data.conversation.recipient._id,
                    query: { recipientId: data.conversation.recipient._id, session_id: useSocket.getState().session_id },
                    type: SourceRefPath.CONVERSATION
                },
                messages: data.conversation.messages,
                previousMessagesCursor: data.nextCursor
            });
        } catch (error) {
            console.error(error);

            error instanceof ApiException && (error.response.status === 404 ? redirect('/') : set({ error: error.message, status: 'error', isRefetching: false }));
        }
    },
    getPreviousMessages: async () => {
        try {
            setChat({ isPreviousMessagesLoading: true });

            const { conversation: { recipient } } = get();
            const { data } = await conversationApi.getPreviousMessages(recipient._id, getChat().previousMessagesCursor!);

            setChat((prevState) => ({ messages: [...data.messages, ...prevState.messages], previousMessagesCursor: data.nextCursor }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot get previous messages', { position: 'top-center' });
        } finally {
            setChat({ isPreviousMessagesLoading: false });
        }
    },
    handleTypingStatus: () => {
        const ctx: { isTyping: boolean; typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return (action: MessageFormState, reset?: boolean) => {
            if (action === 'edit') return;

            if (reset) {
                ctx.isTyping = false;
                clearTimeout(ctx.typingTimeout!);
                return;
            }

            const { conversation: { _id, recipient } } = get();
            const { socket } = useSocket.getState();

            const typingData = { conversationId: _id, recipientId: recipient._id };

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
        };
    },
});