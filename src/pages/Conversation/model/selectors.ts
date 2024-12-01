import { ConversationStore } from './types';

export const contentSelector = (state: ConversationStore) => ({
    _id: state.conversation._id,
    handleTypingStatus: state.actions.handleTypingStatus,
    handleOptimisticUpdate: state.actions.handleOptimisticUpdate,
    getPreviousMessages: state.actions.getPreviousMessages,
    isInitiatorBlocked: state.conversation.isInitiatorBlocked,
    isRecipientBlocked: state.conversation.isRecipientBlocked,
    recipient: state.conversation.recipient,
    isRecipientTyping: state.isRecipientTyping
});