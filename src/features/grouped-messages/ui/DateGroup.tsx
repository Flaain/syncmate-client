import { Message } from '@/shared/model/types';
import { Typography } from '@/shared/ui/Typography';

import { MessageGroupProps, UserGroup } from './UserGroup';

export const DateGroup = ({
    entrie,
    firstMessageRef,
    isLastGroup,
    isFirstGroup
}: Omit<MessageGroupProps, 'messages'> & { entrie: [string, Array<Array<Message>>]; isFirstGroup: boolean }) => {
    const date = new Date(entrie[0]);
    const currentDate = new Date();

    return (
        <div className='flex gap-2 flex-col max-w-3xl w-full mx-auto px-5'>
            <Typography
                weight='medium'
                className='px-[10px] pointer-events-none select-none py-[4.5px] text-[15px] !bg-menu-background-color backdrop-blur-[50px] top-0 my-1 rounded-full !text-white sticky bottom-1 z-[999] mx-auto'
            >
                {entrie[0] === currentDate.toDateString() ? 'Today' : `${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}${date.getFullYear() !== currentDate.getFullYear() ? `, ${date.getFullYear()}` : ''}`}
            </Typography>
            {entrie[1].map((messages, index, array) => (
                <UserGroup
                    key={messages[0]._id}
                    messages={messages}
                    firstMessageRef={isFirstGroup && index === 0 ? firstMessageRef : null}
                    isLastGroup={isLastGroup && index === array.length - 1}
                />
            ))}
        </div>
    );
};