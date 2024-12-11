import { Copy, XCircle } from 'lucide-react';
import { CMItem } from '../ContextMenu';

export const PendingContextMenu = ({ actions }: { actions: { copy: () => void; abort: () => void } }) => (
    <>
        <CMItem text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        <CMItem
            variant='destructive'
            text='Cancel sending'
            icon={<XCircle className='size-4 text-red-400' />}
            onClick={actions.abort}
        />
    </>
);