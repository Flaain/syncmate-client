import { useSocket } from '@/shared/model/store';
import { ActionsProvider, MessageFormState } from '@/shared/model/types';

import { CONVERSATION_EVENTS, ConversationStore } from './types';

export const conversationActions = ({ get }: Pick<ActionsProvider<ConversationStore>, 'get'>): ConversationStore['actions'] => ({
    handleTypingStatus: () => {
        const ctx: { isTyping: boolean; typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return (action: MessageFormState, reset?: boolean) => {
            if (action === 'edit' || reset) {
                reset && ((ctx.isTyping = false), clearTimeout(ctx.typingTimeout!));
                return;
            };
            
            const { conversation: { _id, recipient } } = get(), { socket } = useSocket.getState();
            const typingData = { conversationId: _id, recipientId: recipient._id };
            
            !ctx.isTyping ? ((ctx.isTyping = true), socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData)) : clearTimeout(ctx.typingTimeout!);

            ctx.typingTimeout = setTimeout(() => {
                ctx.isTyping = false;
                socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
            }, 5000);
        };
    },
});