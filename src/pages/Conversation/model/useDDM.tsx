import { useShallow } from 'zustand/shallow';

import { profileApi } from '@/entities/profile';

import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { Confirm } from '@/shared/ui/Confirm';

import { conversationApi } from '../api';

import { useConversation } from './context';
import { recipientSelector } from './selectors';

export const useDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));
    
    const recipient = useConversation(recipientSelector);

    const handleBlockRecipient = async (type: 'block' | 'unblock', event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();

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
            bodyClassName: 'h-auto p-5 w-fit'
        });        
    }

    const handleDeleteConversation = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();

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
            bodyClassName: 'h-auto p-5 w-fit'
        });   
    };

    return {
        handleBlockRecipient,
        handleDeleteConversation,
    };
};