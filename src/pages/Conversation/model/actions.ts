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
import { MessageFormState } from '@/features/SendMessage/model/types';
import { api } from '@/shared/api';

export const conversationActions = (
    set: SetStateInternal<ConversationStore>,
    get: () => ConversationStore,
    setChat: SetStateInternal<ChatStore>,
    getChat: () => ChatStore
): ConversationStore['actions'] => ({
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
            set({ status: action === 'init' ? 'loading' : 'refetching' });

            const { data } = await conversationApi.get(recipientId, abortController?.signal);

            set({ conversation: data.conversation, status: 'idle', error: null });

            setChat({
                params: {
                    apiUrl: '/message',
                    id: data.conversation.recipient._id,
                    query: { recipientId: data.conversation.recipient._id, session_id: useSocket.getState().session_id },
                    type: 'conversation'
                },
                messages: data.conversation.messages,
                previousMessagesCursor: data.nextCursor
            });
        } catch (error) {
            console.error(error);

            error instanceof ApiException && (error.response.status === 404 ? redirect('/') : set({ error: error.message, status: 'error' }));
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
            inReply: currentDraft?.state === 'reply' || currentDraft?.selectedMessage?.inReply,
            status: 'pending',
            actions: { abort: () => abortController.abort('Request was cancelled') },
            replyTo:
                currentDraft?.state === 'reply'
                    ? {
                          _id: currentDraft.selectedMessage?._id!,
                          text: currentDraft.selectedMessage?.text!,
                          senderRefPath: SenderRefPath.USER,
                          sender: {
                              _id: currentDraft.selectedMessage?.sender._id!,
                              name: currentDraft.selectedMessage?.sender.name!
                          }
                      }
                    : currentDraft?.selectedMessage?.replyTo
        };

        const rollback = (prevState: ChatStore) => ({ messages: currentDraft?.state === 'edit' ? prevState.messages.map((m) => m._id === optimisticMessage._id ? currentDraft.selectedMessage! : m) : prevState.messages.filter((m) => m._id !== optimisticMessage._id) });

        abortController.signal.onabort = () => setChat(rollback);

        const handleResend = async (error: ApiException) => {
            try {
                setChat((prevState) => ({ 
                    messages: prevState.messages.map((m) => m._id === optimisticMessage._id ? { ...m, actions: { abort: () => abortController.abort('Request was cancelled') }, status: 'pending' } : m) 
                }));

                onSuccess(await api.call<Message>(error.config))
            } catch (error) {
                onError(error);
            }
        };

        const onSuccess = (data: Message) => {
            setChat((prevState) => ({
                messages: prevState.messages.map((message) => {
                    if (message._id === optimisticMessage._id) return data;
                    if (message.inReply && message.replyTo?._id === data._id) return { ...message, replyTo: { ...message.replyTo, text: data.text } };

                    return message;
                })
            }));
        }

        const onError = (error: unknown, _?: string) => {
            error instanceof ApiException && setChat((prevState) => ({ messages: prevState.messages.map((m) => m._id === optimisticMessage._id ? { ...m, status: 'error', actions: { resend: () => handleResend(error), remove: () => setChat(rollback) } } : m) }));
        };

        setChat((prevState) => ({ messages: currentDraft?.state === 'edit' ? prevState.messages.map((m) => m._id === currentDraft.selectedMessage?._id ? optimisticMessage : m) : [...prevState.messages, optimisticMessage] }));

        return { signal: abortController.signal, onSuccess, onError };
    }
});