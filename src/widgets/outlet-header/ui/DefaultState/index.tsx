import { Loader2 } from 'lucide-react';

import Verified from '@/shared/lib/assets/icons/verified.svg?react';

import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { DDM } from '@/shared/ui/DDM';
import { Typography } from '@/shared/ui/Typography';

import { OutletHeaderProps } from '../../model/types';

export const DefaultState = ({ name, description, dropdownContent, isOfficial, ...rest }: OutletHeaderProps) => {
    const isConnected = useSocket((state) => state.isConnected);
    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);

    return (
        <div {...rest} className='flex flex-col items-start w-full'>
            <div className='flex items-center w-full'>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn('mr-auto', isOfficial && 'flex items-center gap-2')}
                >
                    {name}
                    {isOfficial && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                {dropdownContent && (
                    <DDM align='end'>
                        {dropdownContent}
                    </DDM>
                )}
            </div>
            {isConnected && connectedToNetwork ? (
                <Typography as='p' variant='secondary'>
                    {description}
                </Typography>
            ) : (
                <Typography className='flex items-center gap-2'>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    {!connectedToNetwork ? 'Waiting for network' : 'Connecting'}
                </Typography>
            )}
        </div>
    );
};