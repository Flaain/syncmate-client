import { getUseCtxMenuMessageSelector, useChat } from '@/shared/lib/providers/chat';
import { useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { Draft, useLayout } from '@/shared/model/store';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { messageApi } from '../api';
import { endpoints } from '../model/constants';
import { Message } from '../model/types';

export const useCtxMenuMessage = (message: Message) => {
    const { params, isContextActionsBlocked } = useChat(useShallow(getUseCtxMenuMessageSelector));
    
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard');
    }, []);

    const handleMessageDelete = React.useCallback(async () => {
        onAsyncActionModal(() => messageApi.delete({ endpoint: `${endpoints[params.type]}/delete/${params.id}`, messageIds: [message._id] }), {
            closeOnError: true,
            onReject: () => toast.error('Cannot delete message')
        });
    }, [params.id, message]);

    const handleContextAction = React.useCallback((draft: Draft) => {
        if (isContextActionsBlocked) return;
        
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);

            newState.set(params.id, draft);

            return { drafts: newState };
        });
    }, [isContextActionsBlocked]);

    return {
        handleCopyToClipboard,
        handleMessageDelete,
        handleContextAction
    };
};