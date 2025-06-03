
import { useShallow } from 'zustand/shallow';

import { profileApi } from '@/entities/profile';

import { setChatSelector, useChat } from '@/shared/lib/providers/chat';
import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { capitalizeFirstLetter } from '@/shared/lib/utils/capitalizeFirstLetter';
import { Confirm } from '@/shared/ui/Confirm';

import { conversationApi } from '../api';

import { useConversation } from './context';
import { recipientSelector } from './selectors';

// TODO: optimize confirm configs

export const useDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));
    
    const setChat = useChat(setChatSelector);

    const recipient = useConversation(recipientSelector);
    
    const handleSelectMessages = () => setChat((prevState) => ({ 
        mode: prevState.mode === 'default' ? 'selecting' : 'default', 
        selectedMessages: new Map() 
    }));

    const onBlockUnblockRecipient = (type: 'block' | 'unblock') => onAsyncActionModal(() => profileApi[type]({ recipientId: recipient._id }), {
        closeOnError: true,
        onReject: () => toast.error(`Failed to ${type} user`)
    })

    const onDeleteConversation = () => onAsyncActionModal(() => conversationApi.delete(recipient._id), {
        closeOnError: true,
        onReject: () => toast.error('Failed to delete conversation')
    });

    const getConfirmConfig = (action: 'block' | 'unblock' | 'delteChat'): ModalConfig => {
        const isBlockUnblock = action === 'block' || action === 'unblock';
        
        return {
            content: (
                <Confirm
                    withAvatar
                    onConfirm={() => (isBlockUnblock ? onBlockUnblockRecipient(action) : onDeleteConversation())}
                    avatarUrl={recipient.avatar?.url}
                    name={recipient.name}
                    title={isBlockUnblock ? `${capitalizeFirstLetter(action)} ${recipient.name}` : 'Delete chat'}
                    onCancel={onCloseModal}
                    description={`Are you sure you want to ${isBlockUnblock ? `${action} ${recipient.name}` : `delete chat with ${recipient.name}`}?`}
                    onConfirmText={isBlockUnblock ? capitalizeFirstLetter(action) : 'Delete chat'}
                    onConfirmButtonIntent={action !== 'unblock' ? 'destructive' : 'primary'}
                />
            ),
            withHeader: false
        };
    }

    return {
        handleBlockUnblockRecipient: (type: 'block' | 'unblock') => onOpenModal(getConfirmConfig(type)),
        handleDeleteConversation: () => onOpenModal(getConfirmConfig('delteChat')),
        handleSelectMessages
    };
};