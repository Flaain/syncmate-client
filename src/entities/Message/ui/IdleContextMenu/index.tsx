import { CircleCheckBig, Copy, Edit, Reply, Trash2 } from 'lucide-react';
import { CMItem } from '../ContextMenu';

export const IdleContextMenu = ({
    isMessageFromMe,
    actions
}: {
    isMessageFromMe: boolean;
    actions: { reply: () => void; edit: () => void; delete: () => void; copy: () => void; select: () => void };
}) => (
    <>
        <CMItem text='Reply' icon={<Reply className='size-4' />} onClick={actions.reply} />
        <CMItem text='Copy' icon={<Copy className='size-4' />} onClick={actions.copy} />
        {isMessageFromMe && (
            <>
                <CMItem text='Edit' icon={<Edit className='size-4' />} onClick={actions.edit} />
                <CMItem text='Select' icon={<CircleCheckBig className='size-4' />} onClick={actions.select} />
                <CMItem
                    variant='destructive'
                    text='Delete'
                    icon={<Trash2 className='size-4 text-red-400' />}
                    onClick={actions.delete}
                />
            </>
        )}
    </>
);