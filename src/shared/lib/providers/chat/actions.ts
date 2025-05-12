import { useProfile } from '@/entities/profile';

import { api } from '@/shared/api';
import { ApiException } from '@/shared/api/error';
import { useLayout } from '@/shared/model/store';
import { Message, SetStateInternal } from '@/shared/model/types';

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

        const optMsg: Message = {
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

        const rollback = ({ messages }: ChatStore) => {
            const newMessages = new Map(messages.data);

            isEdit ? newMessages.set(smId!, currentDraft.selectedMessage!) : newMessages.delete(optMsg._id);

            return { messages: { ...messages, data: newMessages } };
        }

        abortController.signal.onabort = () => set(rollback);

        const handleResend = async (error: ApiException) => {
            try {
                set(({ messages }) => handleSet(messages, 'pending'));

                const { data } = await api.call<Message>(error.config);

                onSuccess(data);
            } catch (error) {
                onError(error);
            }
        };

        const handleSet = (messages: ChatStore['messages'], status: Extract<Message['status'], 'pending' | 'error'>, error?: ApiException) => {
            const newMessages = new Map(messages.data);
            const actions = status === 'pending' ? optMsg.actions : { resend: () => handleResend(error!), remove: () => set(rollback) };

            isEdit ? newMessages.set(smId!, { ...newMessages.get(smId!)!, status, actions }) : newMessages.set(optMsg._id, optMsg);
            
            setTimeout(() => get().refs.bottomPlaceholderRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
            
            return { messages: { ...messages, data: newMessages } };
        };

        const onSuccess = (data: Message) => {
            set(({ messages }) =>  {
                const newMessages = new Map(messages.data);

                isEdit ? newMessages.set(smId!, { ...currentDraft.selectedMessage, ...data }) : newMessages.set(data._id, data) && newMessages.delete(optMsg._id);

                isEdit && newMessages.forEach((v, k) => v.inReply && v.replyTo?._id === data._id && newMessages.set(k, { ...v, replyTo: { ...v.replyTo, text: data.text } }));

                return { messages: { ...messages, data: newMessages } };
            });
        };

        const onError = (error: unknown, _?: string) => {
            error instanceof ApiException && set(({ messages }) => handleSet(messages, 'error', error));
        };

        set(({ messages }) => handleSet(messages, 'pending'));

        return { signal: abortController.signal, onSuccess, onError };
    }
});