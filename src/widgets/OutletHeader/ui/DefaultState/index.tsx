import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { cn } from '@/shared/lib/utils/cn';
import { Typography } from '@/shared/ui/Typography';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { OutletHeaderProps } from '../../model/types';
import { useLayout, useSocket } from '@/shared/model/store';
import { Button } from '@/shared/ui/button';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/shared/lib/providers/chat/context';

export const DefaultState = ({ name, description, dropdownMenu, isOfficial, ...rest }: OutletHeaderProps) => {
    const isConnected = useSocket((state) => state.isConnected);
    const connectedToNetwork = useLayout((state) => state.connectedToNetwork);
    
    const navigate = useNavigate()
    const setChat = useChat((state) => state.actions.setChat);

    const handleBack = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        navigate('/');
    }

    return (
        <div {...rest} onClick={() => setChat({ showDetails: true })} className='flex flex-col items-start w-full gap-1 cursor-pointer'>
            <div className='flex items-center w-full'>
                <Button variant='text' size='icon' className='md:hidden' onClick={handleBack}>
                    <ArrowLeft className='w-6 h-6' />
                </Button>
                <Typography
                    as='h2'
                    size='lg'
                    weight='medium'
                    variant='primary'
                    className={cn('mr-auto max-md:ml-5', isOfficial && 'flex items-center gap-2')}
                >
                    {name}
                    {isOfficial && (
                        <Typography>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
                {dropdownMenu}
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