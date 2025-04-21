import { Copy, XCircle } from 'lucide-react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { PossibleCtxActions } from '../../model/types';

export const PendingContextMenu = ({ actions }: { actions: Pick<PossibleCtxActions, 'copy' | 'abort'> }) => (
    <>
        <MenuItem type='ctx' text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        <MenuItem
            type='ctx'
            variant='destructive'
            text='Cancel sending'
            icon={<XCircle className='size-4 text-primary-destructive' />}
            onClick={actions.abort}
        />
    </>
);