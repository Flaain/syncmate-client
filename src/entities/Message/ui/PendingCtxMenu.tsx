import CopyIcon from '@/shared/lib/assets/icons/copy.svg?react';
import CrossRoundIcon from '@/shared/lib/assets/icons/crossround.svg?react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { ctxMenuIconStyles } from '../model/constants';
import { PossibleCtxActions } from '../model/types';

export const PendingContextMenu = ({ actions }: { actions: Pick<PossibleCtxActions, 'copy' | 'abort'> }) => (
    <>
        <MenuItem type='ctx' text='Copy' icon={<CopyIcon className={ctxMenuIconStyles} />} onClick={actions.copy} />
        <MenuItem
            type='ctx'
            variant='destructive'
            text='Cancel sending'
            icon={<CrossRoundIcon className={`${ctxMenuIconStyles} text-primary-destructive`} />}
            onClick={actions.abort}
        />
    </>
);