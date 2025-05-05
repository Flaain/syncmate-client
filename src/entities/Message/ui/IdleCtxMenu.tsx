import { CircleCheckBig, Copy, Edit, Reply, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { MenuItem } from '@/shared/ui/MenuItem';

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
            <MenuItem type='ctx' text='Reply' icon={<Reply className='size-4' />} onClick={onItemClick(() => handleContextAction('reply'))} />
            <MenuItem type='ctx' text='Copy' icon={<Copy className='size-4' />} onClick={onCopy} />
            {isMessageFromMe && (
                <>
                    <MenuItem type='ctx' text='Edit' icon={<Edit className='size-4' />} onClick={onItemClick(() => handleContextAction('edit'))} />
                    <MenuItem
                        type='ctx'
                        text='Select'
                        icon={<CircleCheckBig className='size-4' />}
                        onClick={onItemClick(() => handleSelectMessage(message))}
                    />
                    <MenuItem
                        type='ctx'
                        variant='destructive'
                        text='Delete'
                        icon={<Trash2 className='size-4 text-primary-destructive' />}
                        onClick={onItemClick(() => onOpenModal(confirmationConfig))}
                    />
                </>
            )}
        </>
    );
};
