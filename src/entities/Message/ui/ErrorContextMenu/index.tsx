import { Copy, SendHorizontalIcon, Trash2 } from 'lucide-react';
import { CMItem } from '../ContextMenu';

export const ErrorContextMenu = ({
    actions
}: {
    actions: { copy: () => void; resend: () => void; remove: () => void };
}) => (
    <>
        <CMItem text='Resend' icon={<SendHorizontalIcon className='size-4' />} onClick={actions.resend} />
        <CMItem text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        <CMItem
            variant='destructive'
            text='Delete'
            icon={<Trash2 className='size-4 text-red-400' />}
            onClick={actions.remove}
        />
    </>
);