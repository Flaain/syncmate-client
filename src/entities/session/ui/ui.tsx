import { useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { Loader2, X } from 'lucide-react';
import React from 'react';
import { sessionApi } from '../api';
import { iconsMap } from '../model/constants';
import { SessionProps } from '../model/types';

export const Session = ({ session, withDropButton, dropButtonDisabled, onDrop }: SessionProps) => {
    const [isDroping, setIsDroping] = React.useState(false);
    const { userAgent } = session;
    const icon = userAgent ? (iconsMap[userAgent.type as keyof typeof iconsMap]?.[userAgent.name] || iconsMap[userAgent?.type as keyof typeof iconsMap]?.default) : null;
    
    const onAsyncActionModal = useModal((state) => state.actions.onAsyncActionModal);
    
    const handleDrop = async () => {
        setIsDroping(true);
        
        await onAsyncActionModal(() => sessionApi.dropSession(session._id), {
            onResolve: () => {
                onDrop?.(session);
                toast.success('Session dropped');
            },
            onReject: () => toast.error('Failed to drop session'),
            closeOnSuccess: false
        })
        
        setIsDroping(false);
    };

    return (
        <div className='flex items-start gap-5'>
            <div className='p-2 rounded-full flex items-center justify-center dark:bg-primary-dark-50 bg-primary-white'>
                {icon ?? (
                    <Typography
                        as='span'
                        weight='semibold'
                        size='2xl'
                        className='flex items-center justify-center w-7 h-7'
                    >
                        ?
                    </Typography>
                )}
            </div>
            <div className='flex flex-col'>
                <Typography as='h3' variant='primary'>
                    {userAgent?.name ?? 'Unknown'}&nbsp;{userAgent?.version}
                </Typography>
                <Typography as='h3' variant='primary' size='sm'>
                    {userAgent?.os.name ?? 'Unknown'}&nbsp;{userAgent?.os?.version}
                </Typography>
                <Typography as='p' variant='secondary' className='line-clamp-1' size='sm'>
                    Session created at&nbsp;-&nbsp;
                    {new Date(session.createdAt).toLocaleDateString()}
                </Typography>
            </div>
            {withDropButton && (
                <Button
                    variant='text'
                    size='icon'
                    className='p-0 w-6 h-6 ml-auto overflow-hidden'
                    title='drop session'
                    disabled={isDroping || dropButtonDisabled}
                    onClick={handleDrop}
                >
                    {isDroping ? <Loader2 className='w-5 h-5 animate-spin' /> : <X className='w-5 h-5' />}
                </Button>
            )}
        </div>
    );
};