import { useShallow } from 'zustand/shallow';

import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';
import LockIcon from '@/shared/lib/assets/icons/lock.svg?react';
import MuteIcon from '@/shared/lib/assets/icons/mute.svg?react';
import PhoneIcon from '@/shared/lib/assets/icons/phone.svg?react';
import SelectIcon from '@/shared/lib/assets/icons/select.svg?react';
import VideoCameraIcon from '@/shared/lib/assets/icons/videocamera.svg?react';

import { useChat } from '@/shared/lib/providers/chat';
import { MenuItem } from '@/shared/ui/MenuItem';

import { useConversation } from '../model/context';
import { ddmSelector } from '../model/selectors';
import { useDDM } from '../model/useDDM';

export const DDM = () => {
    const { _id, isRecipientBlocked } = useConversation(useShallow(ddmSelector));
    const { handleBlockUnblockRecipient, handleDeleteConversation, handleSelectMessages } = useDDM();

    const chatMode = useChat((state) => state.mode);

    return (
        <>
            <MenuItem className='mt-1 mx-1' type='ddm' text='Mute' icon={<MuteIcon className='size-5' />} />
            <MenuItem className='mx-1' type='ddm' text='Call' icon={<PhoneIcon className='size-5' />} />
            <MenuItem className='mx-1' type='ddm' text='Video Call' icon={<VideoCameraIcon className='size-5' />} />
            <MenuItem
                type='ddm'
                className='mx-1'
                text={`${chatMode === 'default' ? 'Select Messages' : 'Clear Selection'}`}
                onClick={handleSelectMessages}
                icon={<SelectIcon className='size-5' />}
            />
            <MenuItem
                type='ddm'
                className='mx-1'
                onClick={() => handleBlockUnblockRecipient(isRecipientBlocked ? 'unblock' : 'block')}
                text={isRecipientBlocked ? 'Unblock user' : 'Block user'}
                icon={<LockIcon className='size-5' />}
            />
            {_id && (
                <MenuItem
                    type='ddm'
                    className='mx-1 mb-1'
                    variant='destructive'
                    onClick={handleDeleteConversation}
                    icon={<DeleteIcon className='size-5 text-primary-destructive' />}
                    text='Delete Chat'
                />
            )}
        </>
    );
};