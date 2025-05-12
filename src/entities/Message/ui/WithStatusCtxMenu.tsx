import CopyIcon from '@/shared/lib/assets/icons/copy.svg?react';
import CrossRoundIcon from '@/shared/lib/assets/icons/crossround.svg?react';
import Delete from '@/shared/lib/assets/icons/delete.svg?react';
import Send from '@/shared/lib/assets/icons/send.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { ctxMenuIconStyles } from '../model/constants';
import { WithStatusCtxMenuProps } from '../model/types';

export const WithStatusCtxMenu = ({ actions, onCopy, onItemClick, status }: WithStatusCtxMenuProps) => (
    <>
        <MenuItem
            type='ctx'
            text='Copy'
            icon={<CopyIcon className={ctxMenuIconStyles} />}
            onClick={onItemClick(onCopy)}
        />
        {status === 'error' && (
            <MenuItem
                type='ctx'
                text='Resend'
                icon={<Send className={ctxMenuIconStyles} />}
                onClick={onItemClick(actions?.resend)}
            />
        )}
        {status === 'error' && (
            <MenuItem
                type='ctx'
                variant='destructive'
                text='Delete'
                icon={<Delete className={`${ctxMenuIconStyles} text-primary-destructive`} />}
                onClick={onItemClick(actions?.remove)}
            />
        )}
        {status === 'pending' && (
            <MenuItem
                type='ctx'
                variant='destructive'
                text='Cancel sending'
                icon={<CrossRoundIcon className={`${ctxMenuIconStyles} text-primary-destructive`} />}
                onClick={onItemClick(actions?.abort)}
            />
        )}
    </>
);