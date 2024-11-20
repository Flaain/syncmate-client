import { ContextMenuItem } from '@/shared/ui/context-menu';
import { Message } from '../../model/types';
import { Typography } from '@/shared/ui/Typography';
import { Copy, XCircle } from 'lucide-react';

export const PendingContextMenu = ({ message, handleCopyToClipboard }: { message: Message, handleCopyToClipboard: () => void; }) => {
    return (
        <>
            <ContextMenuItem
                asChild
                className='active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-light-secondary-color focus:bg-primary-gray dark:focus:bg-light-secondary-color hover:bg-primary-gray'
                onClick={handleCopyToClipboard}
            >
                <li>
                    <Copy className='w-4 h-4' />
                    <Typography size='sm' weight='medium'>
                        Copy
                    </Typography>
                </li>
            </ContextMenuItem>
            <ContextMenuItem
                asChild
                className='active:scale-95 flex transition-colors ease-in-out duration-200 items-center gap-5 dark:text-primary-white text-primary-dark-200 rounded-md dark:hover:bg-primary-destructive/10 focus:bg-primary-gray dark:focus:bg-primary-destructive/10 hover:bg-primary-gray'
                onClick={() => message.abort?.()}
            >
                <li>
                    <XCircle className='w-4 h-4 text-red-400' />
                    <Typography className='dark:text-red-400' size='sm' weight='medium'>
                        Cancel sending
                    </Typography>
                </li>
            </ContextMenuItem>
        </>
    );
};