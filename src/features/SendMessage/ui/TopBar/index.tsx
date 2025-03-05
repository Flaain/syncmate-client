import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { Edit2Icon, Reply, X } from 'lucide-react';
import { MessageFormState, MessageTopBarProps } from '../../model/types';
import { useEvents } from '@/shared/model/store';

const iconStyles = 'dark:text-primary-white text-primary-gray min-w-5 h-5';

const config: Record<Exclude<MessageFormState, 'send'>, { title: string; icon: React.ReactNode }> = {
    edit: {
        title: 'Edit message',
        icon: <Edit2Icon className={iconStyles} />
    },
    reply: {
        title: 'Reply to message',
        icon: <Reply className={iconStyles} />
    }
};

export const TopBar = ({ onClose, state, description, preventClose }: MessageTopBarProps) => {
    const settings = config[state as keyof typeof config];

    const addEventListener = useEvents((state) => state.addEventListener);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            !preventClose && event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <div className='overscroll-contain border-b border-solid dark:border-primary-dark-50 border-primary-gray w-full flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out py-3 px-4 gap-4 box-border'>
            {settings.icon}
            <div className='flex flex-col w-full'>
                <Typography size='md' weight='medium' variant='primary'>
                    {settings.title}
                </Typography>
                {description && (
                    <Typography as='p' variant='secondary' className='line-clamp-1'>
                        {description}
                    </Typography>
                )}
            </div>
            <Button variant='text' className='ml-auto pr-0' onClick={onClose} disabled={preventClose}>
                <X className='w-6 h-6' />
            </Button>
        </div>
    );
};