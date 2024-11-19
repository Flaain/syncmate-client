import React from 'react';
import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';
import { useEvents } from '@/shared/model/store';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { FeedTypes } from '@/widgets/Feed/types';

interface OutletDetailsProps {
    name: string;
    description?: string;
    info?: React.ReactNode;
    avatarSlot: React.ReactNode;
}

const titles: Record<FeedTypes.CONVERSATION | FeedTypes.GROUP, string> = {
    Conversation: 'User Info',
    Group: 'Group Info'
};

export const OutletDetails = ({ avatarSlot, name, description, info }: OutletDetailsProps) => {
    const addEventListener = useEvents((state) => state.addEventListener);
    
    const { type, setChat } = useChat(useShallow((state) => ({
        type: state.params.type,
        setChat: state.actions.setChat
    })));

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.stopImmediatePropagation();

            event.key === 'Escape' && setChat({ showDetails: false });
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <div className='flex flex-col gap-10 max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] px-5 py-3 dark:bg-primary-dark-100 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'>
            <div className='flex items-center gap-5'>
                <Button onClick={() => setChat({ showDetails: false })} size='icon' variant='text' className='p-0'>
                    <X />
                </Button>
                <Typography weight='semibold' size='xl'>
                    {titles[type as keyof typeof titles]}
                </Typography>
            </div>
            <div className='flex flex-col items-center justify-center'>
                {avatarSlot}
                <Typography weight='semibold' size='xl' className='mt-2'>
                    {name}
                </Typography>
                {description && (
                    <Typography as='p' variant='secondary'>
                        {description}
                    </Typography>
                )}
            </div>
            {info}
        </div>
    );
};