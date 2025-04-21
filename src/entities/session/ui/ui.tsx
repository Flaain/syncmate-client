import React from 'react';

import { Loader2, X } from 'lucide-react';

import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/button';
import { Confirm } from '@/shared/ui/Confirm';
import { Typography } from '@/shared/ui/Typography';

import { sessionApi } from '../api';
import { iconsMap } from '../model/constants';
import { SessionProps } from '../model/types';

export const Session = ({ session, withDropButton, dropButtonDisabled, onDrop }: SessionProps) => {
    const [isDroping, setIsDroping] = React.useState(false);

    const { userAgent } = session;
    const { onAsyncActionModal, onOpenModal, onCloseModal } = useModal(selectModalActions);

    const icon = iconsMap[userAgent?.browser.name as keyof typeof iconsMap] ?? null;
    const createdAt = new Date(session.createdAt);
    
    const handleDrop = async () => {
        setIsDroping(true);

        await onAsyncActionModal(() => sessionApi.dropSession(session._id), {
            onResolve: () => {
                onDrop?.(session);
                toast.success('Session was terminated');
            },
            onReject: () => toast.error('Failed to teriminate session'),
            closeOnSuccess: true,
            closeOnError: true
        });

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
                    {userAgent?.browser.name ?? 'Unknown browser'}&nbsp;{userAgent?.browser?.major}
                </Typography>
                <Typography as='h3' variant='primary' size='sm'>
                    {userAgent?.os.name ?? 'Unknown OS'}
                </Typography>
                <Typography as='p' title={`Created at ${createdAt.toLocaleString()}`} variant='secondary' className='mt-1 line-clamp-1' size='sm'>
                    Created at&nbsp;-&nbsp;{createdAt.toLocaleDateString()}
                </Typography>
            </div>
            {withDropButton && (
                <Button
                    variant='text'
                    size='icon'
                    className='p-0 w-6 h-6 ml-auto overflow-hidden'
                    title='drop session'
                    disabled={isDroping || dropButtonDisabled}
                    onClick={() =>
                        onOpenModal({
                            content: (
                                <Confirm
                                    text='Are you sure you want to terminate this session?'
                                    onCancel={onCloseModal}
                                    onConfirmText='Terminate'
                                    onConfirmButtonVariant='destructive'
                                    onConfirm={handleDrop}
                                />
                            ),
                            bodyClassName: 'h-auto p-4',
                            withHeader: false
                        })
                    }
                >
                    {isDroping ? <Loader2 className='w-5 h-5 animate-spin' /> : <X className='w-5 h-5' />}
                </Button>
            )}
        </div>
    );
};