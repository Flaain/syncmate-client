import { useShallow } from 'zustand/shallow';

import { useChat } from '@/shared/lib/providers/chat';
import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { useLayout } from '@/shared/model/store';
import { Message } from '@/shared/model/types';

import { messageApi } from '../api';

import { MESSAGE_ENDPOINTS } from './constants';

export const useIdleCtxMenu = (message: Message) => {
    const { params, isCtxBlocked, handleSelectMessage } = useChat(useShallow((state) => ({
        params: state.params,
        isCtxBlocked: state.isContextActionsBlocked,
        handleSelectMessage: state.actions.handleSelectMessage
    })));
    
    const { onAsyncActionModal } = useModal(useShallow(selectModalActions));

    const handleDeleteMessage = async () => {
        await onAsyncActionModal(
            () =>
                messageApi.delete({
                    endpoint: `${MESSAGE_ENDPOINTS[params.type]}/delete/${params.id}`,
                    messageIds: [message._id]
                }),
            {
                closeOnError: true,
                onReject: () => toast.error('Cannot delete message')
            }
        );
    };

    const handleContextAction = (action: 'reply' | 'edit') => {
        if (isCtxBlocked) return;

        useLayout.setState((prevState) => {
            const newState = new Map(prevState.drafts);

            newState.set(params.id, { state: action, value: action === 'edit' ? message.text : '', selectedMessage: message });

            return { drafts: newState };
        });
    };
    
    return {
        handleSelectMessage,
        handleContextAction,
        handleDeleteMessage,
    };
};