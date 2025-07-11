import React from 'react';

import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';
import ReplyIcon from '@/shared/lib/assets/icons/reply.svg?react';

import { addEventListenerSelector } from '@/shared/model/selectors';
import { useEvents } from '@/shared/model/store';
import { MessageFormState } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { MessageTopBarProps } from '../model/types';

const iconStyles = 'dark:text-primary-white text-primary-gray min-w-6 h-6 max-w-6 w-full';

const config: Record<Exclude<MessageFormState, 'send'>, { title: string; icon: React.ReactNode }> = {
    edit: {
        title: 'Edit message',
        icon: <EditIcon className={iconStyles} />
    },
    reply: {
        title: 'Reply to message',
        icon: <ReplyIcon className={iconStyles} />
    }
};

export const TopBar = ({ onClose, state, description, preventClose }: MessageTopBarProps) => {
    const settings = config[state as keyof typeof config];

    const addEventListener = useEvents(addEventListenerSelector);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            !preventClose && event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <div className='overscroll-contain rounded-t-[16px] dark:border-primary-dark-50 border-primary-gray w-full flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out pt-2 px-4 gap-4 box-border'>
            {settings.icon}
            <div className='flex flex-col w-full dark:bg-primary-gray/10 pl-2 p-1 rounded border-l-4 border-primary-gray'>
                <Typography size='sm' weight='medium' variant='primary'>
                    {settings.title}
                </Typography>
                {description && (
                    <Typography as='p' size='sm' variant='secondary' className='line-clamp-1'>
                        {description}
                    </Typography>
                )}
            </div>
            <Button
                intent='secondary'
                variant='ghost'
                size='icon'
                className='ml-auto'
                onClick={preventClose ? undefined : onClose}
                disabled={preventClose}
            >
                <CloseIcon className='dark:text-primary-gray' />
            </Button>
        </div>
    );
};