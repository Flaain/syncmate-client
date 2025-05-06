import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import VerifiedIcon from '@/shared/lib/assets/icons/verified.svg?react';

import { useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { DDM } from '@/shared/ui/DDM';
import { Typography } from '@/shared/ui/Typography';

import { OutletHeaderProps } from '../../model/types';

export const DefaultState = ({ name, description, dropdownContent, avatar, isOfficial, ...rest }: OutletHeaderProps) => {
    const isConnected = useSocket((state) => state.isConnected);
    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    const isUpdating = useChat((state) => state.isUpdating);

    return (
        <div {...rest} className='flex flex-1 justify-between'>
            <div className='flex items-center gap-4'>
                {avatar}
                <div className='flex flex-col'>
                    <Typography
                        as='h2'
                        weight='medium'
                        variant='primary'
                        className={cn('mr-auto', isOfficial && 'flex items-center gap-2')}
                    >
                        {name}
                        {isOfficial && (
                            <Typography>
                                <VerifiedIcon className='size-5' />
                            </Typography>
                        )}
                    </Typography>
                    <Typography className='flex items-center gap-2' variant='secondary' size='sm'>
                        {(!connectedToNetwork || !isConnected || isUpdating) && <LoaderIcon className='size-5 animate-loading' />}
                        {!connectedToNetwork ? 'Waiting for network' : !isConnected ? 'Connecting' : isUpdating ? 'Updating' : description} 
                    </Typography>
                </div>
            </div>
            {dropdownContent && <DDM align='end'>{dropdownContent}</DDM>}
        </div>
    );
};