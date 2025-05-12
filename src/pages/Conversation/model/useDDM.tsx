import React from 'react';

import { useShallow } from 'zustand/shallow';

import { profileApi } from '@/entities/profile';

import { setChatSelector, useChat } from '@/shared/lib/providers/chat';
import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { Confirm } from '@/shared/ui/Confirm';

import { conversationApi } from '../api';

import { useConversation } from './context';
import { recipientSelector } from './selectors';

export const useDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));
    
    const setChat = useChat(setChatSelector);

    const recipient = useConversation(recipientSelector);

    const handleItemClick = React.useCallback((cb?: (...args: any) => void, ...args: Array<any>) => {
        return (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            event.stopPropagation();
            cb?.(...args);
        }
    }, []);
    
    const handleSelectMessages = () => setChat((prevState) => ({ 
        mode: prevState.mode === 'default' ? 'selecting' : 'default', 
        selectedMessages: new Map() 
    }));

    const handleBlockRecipient = (type: 'block' | 'unblock') => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => profileApi[type]({ recipientId: recipient._id }), {
                        closeOnError: true,
                        onReject: () => toast.error(`Failed to ${type} user`)
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to ${type} ${recipient.name}?`}
                    onConfirmText={type}
                    onConfirmButtonVariant={type === 'block' ? 'destructive' : 'default'}
                />
            ),
            withHeader: false,
        });        
    }

    const handleDeleteConversation = () => {
        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => conversationApi.delete(recipient._id), {
                        closeOnError: true,
                        onReject: () => toast.error('Failed to delete conversation')
                    })}
                    onCancel={onCloseModal}
                    text={`Are you sure you want to delete conversation with ${recipient.name}?`}
                    onConfirmText='Delete'
                    onConfirmButtonVariant='destructive'
                />
            ),
            withHeader: false,
        });   
    };

    return {
        handleBlockRecipient,
        handleDeleteConversation,
        handleItemClick,
        handleSelectMessages
    };
};