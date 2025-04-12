import { MessageSkeleton } from '@/entities/Message/ui/Skeletons';
import { GroupedMessages } from '@/features/GroupedMessages/ui/ui';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../model/useMessagesList';

export const MessagesList = ({ getPreviousMessages }: MessagesListProps) => {
    const { groupedMessages, canFetch, isLoading, isError, isRefetching, refetch, call, listRef } = useMessagesList(getPreviousMessages);

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
            className='overscroll-contain relative flex flex-col size-full px-5 py-2 box-border max-xl:gap-5 gap-3 overflow-auto overflow-x-hidden outline-none'
        >
            {isLoading && (
                <>
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                </>
            )}
            {canFetch && (
                <li className='flex justify-center items-center my-auto'>
                    <Button
                        variant='text'
                        className='p-0 dark:text-primary-white/30 text-primary-white'
                        disabled={isLoading || isRefetching}
                        onClick={isError ? refetch : call}
                    >
                        {isError ? (isRefetching ? (<Loader2 className='size-6 animate-spin' />) : 'try again') : 'Load previous messages'}
                    </Button>
                </li>
            )}
            {groupedMessages.map((messages, index, array) => (
                <GroupedMessages key={messages[0]._id} messages={messages} isLastGroup={index === array.length - 1} />
            ))}
        </ul>
    );
};