import { useShallow } from 'zustand/shallow';

import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';

import { selectStateSelector, useChat } from '@/shared/lib/providers/chat';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { useSelectState } from '../model/useSelectState';

export const SelectState = () => {
    const { selectedMessages, setChat } = useChat(useShallow(selectStateSelector));

    const handleDelete = useSelectState();

    return (
        <div className='flex items-center size-full animate-in slide-in-from-top-5 duration-200'>
            <Button
                ripple
                intent='secondary'
                variant='ghost'
                size='icon'
                className='mr-2 mt-[1px]'
                onClick={() => setChat({ mode: 'default', selectedMessages: new Map() })}
            >
                <CloseIcon className='size-6 text-primary-gray' />
            </Button>
            <Typography>{`${selectedMessages.size} ${selectedMessages.size > 1 ? 'messages' : 'message'}`}</Typography>
            <Button
                ripple
                disabled={!selectedMessages.size}
                onClick={handleDelete}
                variant='ghost'
                className='dark:text-red-500 dark:hover:bg-red-500/20 gap-2 ml-auto'
            >
                <DeleteIcon className='size-6 text-red-500' />
                Delete
            </Button>
        </div>
    );
};