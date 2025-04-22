
import { useShallow } from 'zustand/shallow';

import { getUseCtxMenuMessageSelector, useChat } from '@/shared/lib/providers/chat';
import { useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { useLayout } from '@/shared/model/store';
import { Draft } from '@/shared/model/types';

import { messageApi } from '../api';
import { endpoints } from '../model/constants';
import { Message } from '../model/types';

export const useCtxMenuMessage = (message: Message) => {
    const { params, isContextActionsBlocked } = useChat(useShallow(getUseCtxMenuMessageSelector));
    
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard');
    };

    const handleMessageDelete = () =>
        onAsyncActionModal(
            () =>
                messageApi.delete({
                    endpoint: `${endpoints[params.type]}/delete/${params.id}`,
                    messageIds: [message._id]
                }),
            {
                closeOnError: true,
                onReject: () => toast.error('Cannot delete message')
            }
        )

    const handleContextAction = (draft: Draft) => {
        if (isContextActionsBlocked) return;
        
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);

            newState.set(params.id, draft);

            return { drafts: newState };
        });
    };

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleContextAction
    };
};