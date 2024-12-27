import { SetStateInternal } from '@/shared/model/types';
import { ChatStore } from './types';
import { useProfile } from '@/entities/profile';
import { useLayout } from '@/shared/model/store';
import { Message } from '@/entities/Message/model/types';
import { uuidv4 } from '../../utils/uuidv4';
import { ApiException } from '@/shared/api/error';
import { api } from '@/shared/api';

export const chatActions = (set: SetStateInternal<ChatStore>, get: () => ChatStore): ChatStore['actions'] => ({
    setChat: set,
    getChat: get,
    handleSelectMessage: (message) => {
        const { selectedMessages } = get();
        const hasMessage = selectedMessages.has(message._id);

        if (hasMessage && !(selectedMessages.size - 1)) return set({ mode: 'default', selectedMessages: new Map() });

        const newState = new Map([...selectedMessages]);

        !newState.size && set({ mode: 'selecting' });

        hasMessage ? newState.delete(message._id) : newState.set(message._id, message);

        set({ selectedMessages: newState });
    },
    handleOptimisticUpdate: (message) => {
        const { params: { id, type } } = get();
        const { profile: { _id, name, avatar, isDeleted }, participant } = useProfile.getState();
        
        const abortController = new AbortController();
        const currentDraft = useLayout.getState().drafts.get(id)

        const optimisticMessage = {
            _id: uuidv4(),
            text: message,
            sourceRefPath: type,
            sender: { _id, name, avatar, isDeleted, participant },
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
                          _id: currentDraft.selectedMessage?._id,
                          text: currentDraft.value,
                          sourceRefPath: type,
                          sender: {
                              _id: currentDraft.selectedMessage?.sender._id,
                              name: currentDraft.selectedMessage?.sender.name,
                              isDeleted: currentDraft.selectedMessage?.sender.isDeleted,
                              avatar: currentDraft.selectedMessage?.sender.avatar,
                              participant: (currentDraft.selectedMessage?.sender as any).participant
                          }
                      }
                    : undefined
        };

        const rollback = ({ messages }: ChatStore) => ({
            messages: {
                ...messages,
                data: currentDraft?.state === 'edit' ? messages.data.map((m) => m._id === optimisticMessage._id ? currentDraft.selectedMessage! : m) : messages.data.filter((m) => m._id !== optimisticMessage._id)
            }
        });

        abortController.signal.onabort = () => set(rollback);

        const handleResend = async (error: ApiException) => {
            try {
                set(({ messages }) => ({ 
                    messages: {
                        ...messages,
                        data: messages.data.map((m) => m._id === optimisticMessage._id ? { ...m, actions: { abort: () => abortController.abort('Request was cancelled') }, status: 'pending' } : m)
                    } 
                }));

                onSuccess(await api.call<Message>(error.config))
            } catch (error) {
                onError(error);
            }
        };

        const onSuccess = (data: Message) => {
            set(({ messages }) => ({
                messages: {
                    ...messages,
                    data: messages.data.map((message) => {
                        if (message._id === optimisticMessage._id) return data;
                        if (message.inReply && message.replyTo?._id === data._id) return { ...message, replyTo: { ...message.replyTo, text: data.text } };
    
                        return message;
                    })
                }
            }));
        }

        const onError = (error: unknown, _?: string) => {
            error instanceof ApiException && set(({ messages }) => ({
                messages: {
                    ...messages,
                    data: messages.data.map((m) => m._id === optimisticMessage._id ? { ...m, status: 'error', actions: { resend: () => handleResend(error), remove: () => set(rollback) } } : m)
                }
            }));
        };

        set(({ messages }): any => ({
            messages: {
                ...messages,
                data: currentDraft?.state === 'edit' ? messages.data.map((m) => m._id === currentDraft.selectedMessage?._id ? optimisticMessage : m) : [...messages.data, optimisticMessage]
            }
        }));

        return { signal: abortController.signal, onSuccess, onError };
    }
});