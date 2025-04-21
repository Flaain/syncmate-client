import { IMessage } from '@/entities/Message';
import { useProfile } from '@/entities/profile';

import { api } from '@/shared/api';
import { ApiException } from '@/shared/api/error';
import { useLayout } from '@/shared/model/store';
import { SetStateInternal } from '@/shared/model/types';

import { uuidv4 } from '../../utils/uuidv4';

import { ChatStore } from './types';

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
        const { profile: { _id, name, avatar, isDeleted } } = useProfile.getState();

        const abortController = new AbortController();
        const currentDraft = useLayout.getState().drafts.get(id);
        const date = new Date().toISOString();
        const isEdit = currentDraft?.state === 'edit';
        const isReply = currentDraft?.state === 'reply';
        const smId = currentDraft?.selectedMessage?._id;

        const optimisticMessage = {
            _id: uuidv4(),
            text: message,
            sourceRefPath: type,
            sender: { _id, name, avatar, isDeleted },
            createdAt: date,
            updatedAt: date,
            hasBeenEdited: false,
            inReply: isReply,
            status: 'pending',
            actions: { abort: () => abortController.abort('Request was cancelled') },
            replyTo: isReply ? currentDraft.selectedMessage : undefined
        };

        const rollback = ({ messages }: ChatStore) => ({
            messages: {
                ...messages,
                data: isEdit ? messages.data.map((m) => m._id === smId ? currentDraft.selectedMessage! : m) : messages.data.filter((m) => m._id !== optimisticMessage._id)
            }
        });

        abortController.signal.onabort = () => set(rollback);

        const handleResend = async (error: ApiException) => {
            try {
                set(({ messages }) => ({
                    messages: {
                        ...messages,
                        data: messages.data.map((m) =>
                            m._id === (isEdit ? smId : optimisticMessage._id)
                                ? {
                                      ...m,
                                      actions: optimisticMessage.actions,
                                      status: 'pending'
                                  }
                                : m
                        )
                    }
                }));

                onSuccess(await api.call<IMessage>(error.config));
            } catch (error) {
                onError(error);
            }
        };

        const onSuccess = (data: IMessage) => {
            set(({ messages }) => ({
                messages: {
                    ...messages,
                    data: messages.data.map((message) => {
                        if (message._id === optimisticMessage._id) return data;
                        if (isEdit && message._id === data._id) return { ...currentDraft.selectedMessage, ...data };
                        if (message.inReply && message.replyTo?._id === data._id) return { ...message, replyTo: { ...message.replyTo, text: data.text } };

                        return message;
                    })
                }
            }));
        };

        const onError = (error: unknown, _?: string) => {
            error instanceof ApiException &&
                set(({ messages }) => ({
                    messages: {
                        ...messages,
                        data: messages.data.map((m) =>
                            m._id === (isEdit ? smId : optimisticMessage._id)
                                ? {
                                      ...m,
                                      status: 'error',
                                      actions: { resend: () => handleResend(error), remove: () => set(rollback) }
                                  }
                                : m
                        )
                    }
                }));
        };

        set(({ messages }): any => ({
            messages: {
                ...messages,
                data: isEdit
                    ? messages.data.map((m) =>
                          m._id === smId
                              ? { ...m, text: message, status: 'pending', actions: optimisticMessage.actions }
                              : m
                      )
                    : [...messages.data, optimisticMessage]
            }
        }));

        return { signal: abortController.signal, onSuccess, onError };
    }
});