import { GroupedMessages } from '@/features/grouped-messages';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { Button } from '@/shared/ui/button';
import { MessageSkeleton } from '@/shared/ui/MessageSkeleton';
import { Typography } from '@/shared/ui/Typography';

import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../model/useMessagesList';

export const MessagesList = ({ getPreviousMessages }: MessagesListProps) => {
    const { groupedMessages, canFetch, isLoading, isError, isRefetching, listRef, bottomPlaceholderRef, firstMessageRef, call, refetch } = useMessagesList(getPreviousMessages);

    if (!groupedMessages.length) {
        return (
            <Typography
                variant='primary'
                className='m-auto px-5 z-10 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
            >
                No messages yet
            </Typography>
        );
    }

    return (
        <ul
            ref={listRef}
            className='hoverable-scroll overscroll-contain relative flex flex-col size-full pl-5 pr-3 py-2 box-border max-xl:gap-5 gap-3 overflow-auto overflow-x-hidden outline-none'
        >
            {isLoading && (
                <>
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </>
            )}
            {!!canFetch && (
                <li className='flex justify-center items-center my-auto'>
                    <Button
                        variant='text'
                        className='p-0 dark:text-primary-white/30 text-primary-white'
                        disabled={isLoading || isRefetching}
                        onClick={isError ? refetch : call}
                    >
                        {isError ? (isRefetching ? (<LoaderIcon className='size-6 animate-loading' />) : 'try again') : 'Load previous messages'}
                    </Button>
                </li>
            )}
            {groupedMessages.map((messages, index, array) => (
                <GroupedMessages 
                    key={messages[0]._id} 
                    messages={messages} 
                    firstMessageRef={!index ? firstMessageRef : null}
                    isLastGroup={index === array.length - 1} 
                />
            ))}
            <li ref={bottomPlaceholderRef} className='w-full h-[1px] p-0 max-xl:-m-5 -m-3 opacity-0 pointer-events-none'></li>
        </ul>
    );
};