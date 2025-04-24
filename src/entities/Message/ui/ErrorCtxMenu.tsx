import { Copy, SendHorizontalIcon, Trash2 } from 'lucide-react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { PossibleCtxActions } from '../model/types';

export const ErrorContextMenu = ({ actions }: { actions: Pick<PossibleCtxActions, 'copy' | 'resend' | 'remove'> }) => (
    <>
        <MenuItem type='ctx' text='Resend' icon={<SendHorizontalIcon className='size-4' />} onClick={actions.resend} />
        <MenuItem type='ctx' text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        <MenuItem
            type='ctx'
            variant='destructive'
            text='Delete'
            icon={<Trash2 className='size-4 text-primary-destructive' />}
            onClick={actions.remove}
        />
    </>
);