import { CircleCheckBig, Copy, Edit, Reply, Trash2 } from 'lucide-react';

import { MenuItem } from '@/shared/ui/MenuItem';

import { PossibleCtxActions } from '../../model/types';

export const IdleContextMenu = ({
    isMessageFromMe,
    actions
}: {
    isMessageFromMe: boolean;
    actions: Omit<PossibleCtxActions, 'resend' | 'remove' | 'abort'>;
}) => (
    <>
        <MenuItem type='ctx' text='Reply' icon={<Reply className='size-4' />} onClick={actions.reply} />
        <MenuItem type='ctx' text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        {isMessageFromMe && (
            <>
                <MenuItem type='ctx' text='Edit' icon={<Edit className='size-4' />} onClick={actions.edit} />
                <MenuItem
                    type='ctx'
                    text='Select'
                    icon={<CircleCheckBig className='size-4' />}
                    onClick={actions.select}
                />
                <MenuItem
                    type='ctx'
                    variant='destructive'
                    text='Delete'
                    icon={<Trash2 className='size-4 text-primary-destructive' />}
                    onClick={actions.delete}
                />
            </>
        )}
    </>
);