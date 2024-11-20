import { Typography } from '@/shared/ui/Typography';
import { MessagesList } from '@/widgets/MessagesList';
import { useConversation } from '../../model/context';
import { useChat } from '@/shared/lib/providers/chat/context';

export const ConversationBody = () => {
    const getPreviousMessages = useConversation((state) => state.actions.getPreviousMessages);
    const messages = useChat((state) => state.messages);

    return (
        <>
            {messages?.length ? (
                <MessagesList getPreviousMessages={getPreviousMessages} />
            ) : (
                <Typography
                    variant='primary'
                    className='m-auto px-5 py-2 rounded-full dark:bg-primary-dark-50 bg-primary-white'
                >
                    No messages yet
                </Typography>
            )}
        </>
    );
};
