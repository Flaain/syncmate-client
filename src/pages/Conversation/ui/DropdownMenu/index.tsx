import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';
import { Lock, Trash } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useConversationDDM } from '../../lib/useConversationDDM';
import { useConversation } from '../../model/context';

export const ConversationDDM = () => {
    const { _id, isRecipientBlocked } = useConversation(useShallow((state) => ({
        _id: state.conversation._id,
        isRecipientBlocked: state.conversation.isRecipientBlocked
    })));
    const { handleBlockRecipient, handleDeleteConversation } = useConversationDDM();

    return (
        <>
            {_id && (
                <DropdownMenuItem className='flex items-center gap-5 cursor-pointer rounded-md dark:focus:bg-light-secondary-color text-primary-white'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <path d='m13 11 9-9' />
                        <path d='M14.6 12.6c.8.8.9 2.1.2 3L10 22l-8-8 6.4-4.8c.9-.7 2.2-.6 3 .2Z' />
                        <path d='m6.8 10.4 6.8 6.8' />
                        <path d='m5 17 1.4-1.4' />
                    </svg>
                    Clear history
                </DropdownMenuItem>
            )}
            <DropdownMenuItem
                onClick={(event) => handleBlockRecipient(isRecipientBlocked ? 'unblock' : 'block', event)}
                className='flex items-center gap-5 cursor-pointer rounded-md dark:focus:bg-light-secondary-color text-primary-white'
            >
                <Lock className='w-5 h-5' />
                {isRecipientBlocked ? 'Unblock user' : 'Block user'}
            </DropdownMenuItem>
            {_id && (
                <DropdownMenuItem
                    onClick={handleDeleteConversation}
                    className='flex items-center gap-5 cursor-pointer rounded-md dark:focus:bg-primary-destructive/10 text-primary-destructive'
                >
                    <Trash className='w-5 h-5' /> Delete Conversation
                </DropdownMenuItem>
            )}
        </>
    );
};