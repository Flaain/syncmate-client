import { useShallow } from 'zustand/shallow';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';
import VerifiedIcon from '@/shared/lib/assets/icons/verified.svg?react';

import { useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout, useSocket } from '@/shared/model/store';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { DropdownMenu } from '@/shared/ui/DDM';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';

import { OutletHeaderProps } from '../model/types';

export const DefaultState = ({ name, description, dropdownContent, avatarUrl, isOfficial, ...rest }: OutletHeaderProps) => {
    const isConnected = useSocket((state) => state.isConnected);
    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    
    const { isUpdating, setChat } = useChat(useShallow(({ isUpdating, actions: { setChat } }) => ({ isUpdating, setChat })));

    const handleAvatarClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        event.stopPropagation();

        setChat((prevState) => ({ showDetails: !prevState.showDetails }));
    };

    return (
        <div {...rest} className='flex flex-1 justify-between'>
            <div className='flex items-center gap-4'>
                <Image
                    onClick={handleAvatarClick}
                    src={avatarUrl}
                    skeleton={<AvatarByName name={name} size='md' onClick={handleAvatarClick} />}
                    className='object-cover object-center min-w-10 max-w-10 h-10 rounded-full'
                />
                <div className='flex flex-col'>
                    <Typography
                        as='h2'
                        weight='medium'
                        variant='primary'
                        className={cn('mr-auto', isOfficial && 'flex items-center gap-2')}
                    >
                        {name}
                        {isOfficial && <VerifiedIcon className='size-5 text-primary-blue' />}
                    </Typography>
                    <Typography className='flex items-center gap-2' variant='secondary' size='sm'>
                        {(!connectedToNetwork || !isConnected || isUpdating) && <LoaderIcon className='size-5 animate-loading' />}
                        {!connectedToNetwork ? 'Waiting for network' : !isConnected ? 'Connecting' : isUpdating ? 'Updating' : description}
                    </Typography>
                </div>
            </div>
            {dropdownContent && (
                <DropdownMenu sideOffset={15} align='end'>
                    {dropdownContent}
                </DropdownMenu>
            )}
        </div>
    );
};