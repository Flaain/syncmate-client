import CopyIcon from '@/shared/lib/assets/icons/copy.svg?react';
import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';
import SelectIcon from '@/shared/lib/assets/icons/select.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { ctxMenuIconStyles } from '../model/constants';
import { IdleCtxMenuProps } from '../model/types';
import { useSelectionCtxMenu } from '../model/useSelectionCtxMenu';

export const SelectionCtxMenu = ({ message, onItemClick }: Omit<IdleCtxMenuProps, 'isMessageFromMe' | 'onCopy'>) => {
    const { handleCopy, handleClearSelection, handleDelete, handleSelectMessage, isSelected } = useSelectionCtxMenu(message);
    
    if (!isSelected) return (
        <MenuItem
            type='ctx'
            text='Select'
            icon={<SelectIcon className={ctxMenuIconStyles} />}
            onClick={onItemClick(() => handleSelectMessage(message))}
        />
    )

    return (
        <>
            <MenuItem
                type='ctx'
                text='Copy selected'
                icon={<CopyIcon className={ctxMenuIconStyles} />}
                onClick={onItemClick(handleCopy)}
            />
            <MenuItem
                type='ctx'
                text='Clear selection'
                icon={<SelectIcon className={ctxMenuIconStyles} />}
                onClick={onItemClick(handleClearSelection)}
            />
            <MenuItem
                type='ctx'
                variant='destructive'
                text='Delete selected'
                icon={<DeleteIcon className={`${ctxMenuIconStyles} text-primary-destructive`} />}
                onClick={onItemClick(handleDelete)}
            />
        </>
    );
};
