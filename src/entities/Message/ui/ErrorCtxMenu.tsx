import Copy from '@/shared/lib/assets/icons/copy.svg?react';
import Delete from '@/shared/lib/assets/icons/delete.svg?react';
import Send from '@/shared/lib/assets/icons/send.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { ctxMenuIconStyles } from '../model/constants';
import { PossibleCtxActions } from '../model/types';

export const ErrorContextMenu = ({ actions }: { actions: Pick<PossibleCtxActions, 'copy' | 'resend' | 'remove'> }) => (
    <>
        <MenuItem type='ctx' text='Resend' icon={<Send className={ctxMenuIconStyles} />} onClick={actions.resend} />
        <MenuItem type='ctx' text='Copy' icon={<Copy className={ctxMenuIconStyles} />} onClick={actions.copy} />
        <MenuItem
            type='ctx'
            variant='destructive'
            text='Delete'
            icon={<Delete className={`${ctxMenuIconStyles} text-primary-destructive`} />}
            onClick={actions.remove}
        />
    </>
);