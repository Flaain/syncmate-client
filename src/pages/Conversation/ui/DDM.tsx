import { Lock, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import Broom from '@/shared/lib/assets/icons/broom.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { useConversation } from '../model/context';
import { ddmSelector } from '../model/selectors';
import { useDDM } from '../model/useDDM';

export const DDM = () => {
    const { _id, isRecipientBlocked } = useConversation(useShallow(ddmSelector));
    const { handleBlockRecipient, handleDeleteConversation } = useDDM();

    return (
        <>
            {_id && <MenuItem type='ddm' icon={<Broom className='size-4 text-primary-white' />} text='Clear history' />}
            <MenuItem
                type='ddm'
                onClick={(event) => handleBlockRecipient(isRecipientBlocked ? 'unblock' : 'block', event)}
                text={isRecipientBlocked ? 'Unblock user' : 'Block user'}
                icon={<Lock className='size-4' />}
            />
            {_id && (
                <MenuItem
                    type='ddm'
                    variant='destructive'
                    onClick={handleDeleteConversation}
                    icon={<Trash2 className='size-4 text-primary-destructive' />}
                    text='Delete conversation'
                />
            )}
        </>
    );
};