import { useShallow } from 'zustand/shallow';

import CopyIcon from '@/shared/lib/assets/icons/copy.svg?react';
import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';
import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';
import ReplyIcon from '@/shared/lib/assets/icons/reply.svg?react';
import SelectIcon from '@/shared/lib/assets/icons/select.svg?react';

import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { MenuItem } from '@/shared/ui/MenuItem';

import { ctxMenuIconStyles } from '../model/constants';
import { IdleCtxMenuProps } from '../model/types';
import { useIdleCtxMenu } from '../model/useIdleCtxMenu';

export const IdleContextMenu = ({ isMessageFromMe, message, onCopy, onItemClick }: IdleCtxMenuProps) => {
    const { handleMessageDelete, handleContextAction, handleSelectMessage } = useIdleCtxMenu(message);
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    
    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={onCloseModal}
                onConfirm={handleMessageDelete}
                onConfirmText='Delete'
                text='Are you sure you want to delete this message?'
                onConfirmButtonVariant='destructive'
            />
        ),
        withHeader: false,
    };

    return (
        <>
            <MenuItem type='ctx' text='Reply' icon={<ReplyIcon className={ctxMenuIconStyles} />} onClick={onItemClick(() => handleContextAction('reply'))} />
            <MenuItem type='ctx' text='Copy' icon={<CopyIcon className={ctxMenuIconStyles} />} onClick={onCopy} />
            {isMessageFromMe && (
                <>
                    <MenuItem type='ctx' text='Edit' icon={<EditIcon className={ctxMenuIconStyles} />} onClick={onItemClick(() => handleContextAction('edit'))} />
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
                        onClick={onItemClick(() => onOpenModal(confirmationConfig))}
                    />
                </>
            )}
        </>
    );
};
