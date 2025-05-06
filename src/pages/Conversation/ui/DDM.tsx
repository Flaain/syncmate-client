import { useShallow } from 'zustand/shallow';

import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { useConversation } from '../model/context';
import { ddmSelector } from '../model/selectors';
import { useDDM } from '../model/useDDM';

export const DDM = () => {
    const { _id, isRecipientBlocked } = useConversation(useShallow(ddmSelector));
    const { handleBlockRecipient, handleDeleteConversation } = useDDM();

    return (
        <>
            <MenuItem
                type='ddm'
                onClick={(event) => handleBlockRecipient(isRecipientBlocked ? 'unblock' : 'block', event)}
                text={isRecipientBlocked ? 'Unblock user' : 'Block user'}
                icon={<LockIcon className='size-5' />}
            />
            {_id && (
                <MenuItem
                    type='ddm'
                    variant='destructive'
                    onClick={handleDeleteConversation}
                    icon={<DeleteIcon className='size-5 text-primary-destructive' />}
                    text='Delete conversation'
                />
            )}
        </>
    );
};