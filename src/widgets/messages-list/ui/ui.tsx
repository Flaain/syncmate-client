import { DateGroup } from '@/features/grouped-messages';

import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { useChat } from '@/shared/lib/providers/chat';
import { Button } from '@/shared/ui/button';
import { MessageSkeleton } from '@/shared/ui/MessageSkeleton';
import { Typography } from '@/shared/ui/Typography';

import { MessagesListProps } from '../model/types';
import { useMessagesList } from '../model/useMessagesList';

export const MessagesList = ({ getPreviousMessages }: MessagesListProps) => {
    const {
        groupedMessages,
        canFetch,
        isLoading,
        isError,
        isRefetching,
        listRef,
        bottomPlaceholderRef,
        firstMessageRef,
        call,
        refetch
    } = useMessagesList(getPreviousMessages);
    
    const type = useChat((state) => state.params.type);

    if (!groupedMessages.length) {
        return (
            <Typography
                weight='medium'
                variant='primary'
                className='m-auto px-5 z-10 py-2 rounded-full dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white'
            >
                No messages yet
            </Typography>
        );
    }

    return (
        <div
            ref={listRef}
            className='hoverable-scroll relative overscroll-contain pt-2 box-border max-xl:gap-5 gap-3 overflow-x-hidden overflow-y-auto outline-none'
        >
            {isLoading && (
                <div className='max-w-3xl w-full mx-auto px-5'>
                    <MessageSkeleton type={type} />
                    <MessageSkeleton type={type} />
                    <MessageSkeleton type={type} />
                </div>
            )}
            {!!canFetch && (
                <Button
                    size='text'
                    className='dark:text-primary-white/30 text-primary-white justify-center w-full items-center my-auto min-h-min'
                    disabled={isLoading || isRefetching}
                    onClick={isError ? refetch : call as () => Promise<void>}
                >
                    {isError ? isRefetching ? <LoaderIcon className='size-6 animate-loading' /> : 'try again' : 'Load previous messages'}
                </Button>
            )}
            {groupedMessages.map((entrie, index, array) => (
                <DateGroup
                    key={entrie[0]}
                    entrie={entrie}
                    firstMessageRef={firstMessageRef}
                    isFirstGroup={index === 0}
                    isLastGroup={index === array.length - 1}
                />
            ))}
            <div
                ref={bottomPlaceholderRef}
                className='w-full h-[1px] p-0 opacity-0 pointer-events-none'
            ></div>
        </div>
    );
};
