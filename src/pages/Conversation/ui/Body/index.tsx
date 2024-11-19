import { Typography } from '@/shared/ui/Typography';
import { MessagesList } from '@/widgets/MessagesList';
import { useConversation } from '../../model/context';
import { useShallow } from 'zustand/shallow';

export const ConversationBody = () => {
    const { messages, nextCursor, actions } = useConversation(useShallow((state) => ({
        _id: state.data.conversation._id,
        recipient: state.data.conversation.recipient,
        messages: state.data.conversation.messages,
        nextCursor: state.data.nextCursor,
        actions: state.actions,
    })));

    return (
        <>
            {messages?.length ? (
                <MessagesList
                    messages={messages}
                    getPreviousMessages={actions.getPreviousMessages}
                    nextCursor={nextCursor}
                />
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