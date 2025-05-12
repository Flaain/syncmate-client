import { ConversationStore } from './types';

export const contentSelector = (state: ConversationStore) => ({
    _id: state.conversation._id,
    handleTypingStatus: state.actions.handleTypingStatus,
    isInitiatorBlocked: state.conversation.isInitiatorBlocked,
    isRecipientBlocked: state.conversation.isRecipientBlocked,
    recipient: state.conversation.recipient,
    isRecipientTyping: state.isRecipientTyping
});

export const recipientSelector = (state: ConversationStore) => state.conversation.recipient;
export const ddmSelector = (state: ConversationStore) => ({ _id: state.conversation._id, isRecipientBlocked: state.conversation.isRecipientBlocked });