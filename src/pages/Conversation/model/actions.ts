import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { toast } from 'sonner';
import { useSocket } from '@/shared/model/store';
import { redirect } from 'react-router-dom';
import { SetStateInternal } from '@/shared/model/types';
import { conversationApi } from '../api';
import { ApiException } from '@/shared/api/error';
import { ChatStore } from '@/shared/lib/providers/chat/types';
import { Message, SenderRefPath } from '@/entities/Message/model/types';
import { useProfile } from '@/entities/profile';
import { uuidv4 } from '@/shared/lib/utils/uuidv4';

export const conversationActions = (set: SetStateInternal<ConversationStore>, get: () => ConversationStore, setChat: SetStateInternal<ChatStore>, getChat: () => ChatStore): ConversationStore['actions'] => ({
    getConversation: async (action: 'init' | 'refetch', recipientId: string, abortController?: AbortController) => {
        try {
            action === 'init' ? set({ status: 'loading' }) : set({ isRefetching: true });
            
            const { data } = await conversationApi.get(recipientId, abortController?.signal);

            set({ conversation: data.conversation, status: 'idle', error: null });

            setChat({
                params: {
                    apiUrl: '/message',
                    id: data.conversation.recipient._id,
                    query: { recipientId: data.conversation.recipient._id },
                    type: 'conversation'
                },
                messages: data.conversation.messages,
                previousMessagesCursor: data.nextCursor
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
        const ctx: { isTyping: boolean, typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return (reset?: boolean) => {
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
        }
    },
    handleOptimisticUpdate: (message, currentDraft) => {
        const abortController = new AbortController();
        const profile = useProfile.getState().profile;
        const optimisticMessage: Message = {
            _id: uuidv4(),
            text: message,
            senderRefPath: SenderRefPath.USER,
            sender: {
                _id: profile._id,
                name: profile.name,
                avatar: profile.avatar,
                isDeleted: profile.isDeleted
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            hasBeenEdited: false,
            hasBeenRead: false,
            inReply: currentDraft?.state === 'reply',
            isPending: true,
            abort: () => abortController.abort('Sending message was cancelled'),
            replyTo: currentDraft?.selectedMessage
        }

        const rollback = (prevState: ChatStore) => ({ messages: currentDraft?.state !== 'edit' ? prevState.messages.filter((m) => m._id !== optimisticMessage._id) : prevState.messages.map((m) => m._id === optimisticMessage._id ? currentDraft.selectedMessage! : m) });
        
        abortController.signal.onabort = () => setChat(rollback);

        setChat((prevState) => ({
            messages: currentDraft?.state === 'edit' ? prevState.messages.map((m) => m._id === currentDraft.selectedMessage?._id ? optimisticMessage : m) : [...prevState.messages, optimisticMessage]
        }))

        return {
            signal: abortController.signal,
            onSuccess: (data) => setChat((prevState) => ({ messages: prevState.messages.map((m) => m._id === optimisticMessage._id ? data : m) })),
            onError: (error) => {
                if (error instanceof ApiException) {
                    setChat((prevState) => ({
                        messages: prevState.messages.map((m) => m._id === optimisticMessage._id ? { ...m, isPending: false, error: error.config } : m)
                    }))
                }
            }
        }
    }
});