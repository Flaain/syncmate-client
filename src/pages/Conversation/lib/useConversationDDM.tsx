import { useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { toast } from 'sonner';
import { selectModalActions } from '@/shared/lib/providers/modal/store';
import { useConversation } from '../model/context';
import { useShallow } from 'zustand/shallow';
import { profileApi } from '@/entities/profile';
import { conversationApi } from '../api';

export const useConversationDDM = () => {
    const { onAsyncActionModal, onCloseModal, onOpenModal } = useModal(useShallow(selectModalActions));
    
    const recipient = useConversation((state) => state.conversation.recipient);

    const handleBlockRecipient = async (type: 'block' | 'unblock', event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => profileApi[type]({ recipientId: recipient._id }), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error(`Failed to ${type} user`);
                        }
                    })}
                    onCancel={onCloseModal()}
                    text={`Are you sure you want to ${type} ${recipient.name}?`}
                    onConfirmText={type}
                    onConfirmButtonVariant={type === 'block' ? 'destructive' : 'default'}
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5 w-fit'
        });        
    }

    const handleDeleteConversation = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();

        onOpenModal({
            content: (
                <Confirm
                    onConfirm={() => onAsyncActionModal(() => conversationApi.delete(recipient._id), {
                        closeOnError: true,
                        onReject: () => {
                            toast.error('Failed to delete conversation');
                        }
                    })}
                    onCancel={onCloseModal()}
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