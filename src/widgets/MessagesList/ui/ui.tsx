import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { GroupedMessages } from '@/features/GroupedMessages/ui/ui';
import { useMessagesList } from '../model/useMessagesList';
import { MessagesListProps } from '../model/types';
import { Typography } from '@/shared/ui/Typography';

export const MessagesList = ({ getPreviousMessages }: MessagesListProps) => {
    const { groupedMessages, canFetch, isPreviousMessagesLoading, previousMessagesCursor, listRef } = useMessagesList(getPreviousMessages);

    if (!groupedMessages.length) {
        return (
            <Typography
                variant='primary'
                className='m-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
            >
                No messages yet
            </Typography>
        );
    }

    return (
        <ul
            ref={listRef}
            className='relative flex flex-col justify-start w-full h-full p-5 max-xl:gap-5 gap-3 overflow-x-hidden outline-none'
        >
            {previousMessagesCursor && (
                <li className='flex justify-center items-center'>
                    <Button
                        variant='text'
                        className='p-0 dark:text-primary-white/30 text-primary-white'
                        disabled={!canFetch}
                        onClick={getPreviousMessages}
                    >
                        {isPreviousMessagesLoading ? (
                            <Loader2 className='w-6 h-6 animate-spin' />
                        ) : (
                            'Load previous messages'
                        )}
                    </Button>
                </li>
            )}
            {groupedMessages.map((messages, index, array) => (
                <GroupedMessages
                    key={messages[0]._id}
                    messages={messages}
                    isLastGroup={index === array.length - 1}
                />
            ))}
        </ul>
    );
};