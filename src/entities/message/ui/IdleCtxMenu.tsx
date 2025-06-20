import { useShallow } from 'zustand/shallow';

import CheckCheckIcon from '@/shared/lib/assets/icons/checkcheck.svg?react';
import CopyIcon from '@/shared/lib/assets/icons/copy.svg?react';
import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';
import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';
import ReplyIcon from '@/shared/lib/assets/icons/reply.svg?react';
import SelectIcon from '@/shared/lib/assets/icons/select.svg?react';

import { useChat } from '@/shared/lib/providers/chat';
import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { getRelativeMessageTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { Confirm } from '@/shared/ui/Confirm';
import { MenuItem } from '@/shared/ui/MenuItem';
import { Typography } from '@/shared/ui/Typography';

import { ctxMenuIconStyles } from '../model/constants';
import { IdleCtxMenuProps } from '../model/types';
import { useIdleCtxMenu } from '../model/useIdleCtxMenu';

export const IdleContextMenu = ({ isMessageFromMe, message, onCopy, onItemClick }: IdleCtxMenuProps) => {
    const { handleDeleteMessage, handleContextAction, handleSelectMessage } = useIdleCtxMenu(message);
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    
    const info = useChat(useShallow((state) => state.chatInfo));

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                withAvatar
                avatarUrl={info.avatar?.url}
                title='Delete message'
                description='Are you sure you want to delete this message?'
                onConfirm={handleDeleteMessage}
                onCancel={onCloseModal}
                name={info.name}
                onConfirmButtonIntent='destructive'
                onConfirmText='Delete'
            />
        ),
        withHeader: false
    };

    return (
        <>
            {isMessageFromMe && message.hasBeenRead && (
                <>
                    <div className='flex items-center gap-2 px-2 pt-1'>
                        <CheckCheckIcon className='size-5' />
                        <Typography size='sm'>{getRelativeMessageTimeString(message.readedAt!)}</Typography>
                    </div>
                    <hr className='dark:bg-primary-dark-50 h-1 -mx-1 opacity-20 my-1' />
                </>
            )}
            <MenuItem
                type='ctx'
                text='Reply'
                icon={<ReplyIcon className={ctxMenuIconStyles} />}
                onClick={onItemClick(() => handleContextAction('reply'))}
            />
            <MenuItem type='ctx' text='Copy' icon={<CopyIcon className={ctxMenuIconStyles} />} onClick={onCopy} />
            {isMessageFromMe && (
                <>
                    <MenuItem
                        type='ctx'
                        text='Edit'
                        icon={<EditIcon className={ctxMenuIconStyles} />}
                        onClick={onItemClick(() => handleContextAction('edit'))}
                    />
                    <MenuItem
                        type='ctx'
                        text='Select'
                        icon={<SelectIcon className={ctxMenuIconStyles} />}
                        onClick={onItemClick(() => handleSelectMessage(message))}
                    />
                    <MenuItem
                        type='ctx'
                        variant='destructive'
                        text='Delete'
                        icon={<DeleteIcon className={`${ctxMenuIconStyles} text-primary-destructive`} />}
                        onClick={onItemClick(() => onOpenModal(confirmationConfig), 'delete')}
                    />
                </>
            )}
        </>
    );
};